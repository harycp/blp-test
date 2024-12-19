const Book = require("../models/books");
const BlobContent = require("../models/blobContent");
const BlobBook = require("../models/blobBook");
const fs = require("fs");
const { encrypt, decrypt } = require("../utils/crypto");

exports.index = async (req, res) => {
  try {
    const { genre } = req.query;
    const filter = genre
      ? { genre, user: req.user._id }
      : { user: req.user._id };
    const books = await Book.find(filter).sort({ title: "asc" });

    const booksWithEncryptedIds = books.map((book) => ({
      ...book.toObject(),
      encryptedId: encrypt(book._id.toString()),
    }));

    res.render("books/index", {
      books: booksWithEncryptedIds,
      genre: genre || "All",
    });
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/login");
  }
};

exports.create = (req, res) => {
  res.render("books/create");
};

exports.store = async (req, res) => {
  try {
    const bookData = req.body;
    bookData.user = req.user._id;

    const book = new Book(bookData);
    await book.save();

    if (req.file) {
      const base64File = req.file.buffer.toString("base64");

      const blobContent = new BlobContent({
        content: base64File,
        mimeType: req.file.mimetype,
      });
      await blobContent.save();

      const blobBook = new BlobBook({
        id_book: book._id,
        id_blob: blobContent._id,
      });
      await blobBook.save();
    }

    req.flash("flash_message", "Book created successfully");
    res.redirect("/books");
  } catch (err) {
    req.flash("flash_message", "Failed to create book");
    res.status(500).redirect("/books");
  }
};

exports.show = async (req, res) => {
  try {
    const encryptedId = req.params.id;
    const id = decrypt(encryptedId);

    const book = await Book.findById(id).populate({
      path: "user",
      select: "_id",
    });

    if (!book) {
      return res.status(404).send("Book not found");
    }

    book.encryptedId = encryptedId;

    const blobBook = await BlobBook.findOne({ id_book: book._id });

    let blobContent = null;
    let base64Image = null;

    if (blobBook) {
      blobContent = await BlobContent.findById(blobBook.id_blob);
      if (blobContent) {
        base64Image = blobContent.content;
      }
    }

    res.render("books/show", { book, blobContent, base64Image });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.edit = async (req, res) => {
  try {
    const encryptedId = req.params.id;
    const id = decrypt(encryptedId);

    const book = await Book.findById(id);
    const blobBook = await BlobBook.findOne({ id_book: book._id });

    let blobContent = null;
    if (blobBook) {
      blobContent = await BlobContent.findById(blobBook.id_blob);
    }

    book.encryptedId = encryptedId;

    res.render("books/edit", { book, blobContent });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const encryptedId = req.params.id;
    const id = decrypt(encryptedId);

    const { file } = req;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (file) {
      const base64File = req.file.buffer.toString("base64");

      const newBlobContent = new BlobContent({
        content: base64File,
        mimeType: file.mimetype,
      });

      await newBlobContent.save();

      const blobBook = await BlobBook.findOne({ id_book: updatedBook._id });
      if (blobBook) {
        blobBook.id_blob = newBlobContent._id;
        await blobBook.save();
      } else {
        const newBlobBook = new BlobBook({
          id_book: updatedBook._id,
          id_blob: newBlobContent._id,
        });
        await newBlobBook.save();
      }
    }

    req.flash("flash_message", "Book updated successfully");
    res.redirect("/books");
  } catch (err) {
    req.flash("flash_message", "Failed to update book");
    res.status(500).redirect("/books");
  }
};

exports.delete = async (req, res) => {
  try {
    const encryptedId = req.params.id;
    const id = decrypt(encryptedId);

    const blobBook = await BlobBook.findOne({ id_book: id });

    if (blobBook) {
      const blobContent = await BlobContent.findById(blobBook.id_blob);
      if (blobContent) {
        await BlobContent.findByIdAndDelete(blobContent._id);
      }

      await BlobBook.findByIdAndDelete(blobBook._id);
    }

    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    req.flash("flash_message", "Book and related image deleted successfully");
    res.redirect("/books");
  } catch (err) {
    req.flash("flash_message", "Error deleting book");
    res.status(500).redirect("/books");
  }
};
