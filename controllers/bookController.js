const Book = require("../models/books");
const BlobContent = require("../models/blobContent");
const BlobBook = require("../models/blobBook");
const fs = require("fs");

exports.index = async (req, res) => {
  try {
    const { genre } = req.query;
    const filter = genre
      ? { genre, user: req.user._id }
      : { user: req.user._id };
    const books = await Book.find(filter).sort({ title: "asc" });
    res.render("books/index", { books, genre: genre || "All" });
  } catch (err) {
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
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64File = fileBuffer.toString("base64");

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

      await blobContent.save();
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
    const { id } = req.params;

    const book = await Book.findById(id).populate("user");

    if (!book) {
      return res.status(404).send("Book not found");
    }

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
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render("books/edit", { book });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash("flash_message", "Book updated successfully");
    res.redirect(`/books`);
  } catch (err) {
    req.flash("flash_message", "Failed to update book");
    res.status(500).redirect("/books");
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    const blobBook = await BlobBook.findOne({ book: book._id });
    if (blobBook) {
      await BlobContent.findByIdAndDelete(blobBook.blob);
      await blobBook.delete();
    }

    req.flash("flash_message", "Book deleted successfully");
    res.redirect("/books");
  } catch (err) {
    req.flash("flash_message", "Error deleting book");
    res.status(500).redirect("/books");
  }
};
