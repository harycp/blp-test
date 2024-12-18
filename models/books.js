const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    min: 0,
    required: true,
  },
  genre: {
    type: String,
    enum: [
      "fiction",
      "non-fiction",
      "thriller",
      "romance",
      "history",
      "philosophy",
    ],
    required: true,
  },
  year: {
    type: Number,
    min: 0,
    max: new Date().getFullYear(),
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
