const Book = require("../models/books");

// Menampilkan daftar buku
exports.index = async (req, res) => {
  try {
    const { genre } = req.query;
    const books = genre ? await Book.find({ genre }) : await Book.find({});
    res.render("books/index", { books, genre: genre || "All" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Menampilkan form untuk menambah buku baru
exports.create = (req, res) => {
  res.render("books/create");
};

// Menambahkan buku baru
exports.store = async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) bookData.file = req.file.path;
    const book = new Book(bookData);
    await book.save();
    res.redirect(`/books/${book._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Menampilkan detail buku
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
    res.redirect(`/books/${updatedBook._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Menghapus buku
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
