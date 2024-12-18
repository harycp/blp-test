const Book = require("../models/books");

exports.index = async (req, res) => {
  try {
    const { genre } = req.query;
    const books = genre ? await Book.find({ genre }) : await Book.find({});
    req.flash("flash_message", "Berhasil Login");
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
    if (req.file) bookData.file = req.file.path;
    const book = new Book(bookData);
    await book.save();
    req.flash("flash_message", "Book created successfully");
    res.redirect(`/books/${book._id}`);
  } catch (err) {
    req.flash("flash_message", "Failed to create book");
    res.status(500).redirect("/books");
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render("books/show", { book });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Menampilkan form untuk mengedit buku
exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render("books/edit", { book });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Mengupdate data buku
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
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

// Menghapus buku
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash("flash_message", "Book deleted successfully");
    res.redirect("/books");
  } catch (err) {
    req.flash("flash_message", "Error deleting book");
    res.status(500).redirect("/books");
  }
};
