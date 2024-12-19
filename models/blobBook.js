const mongoose = require("mongoose");
const { Schema } = mongoose;

const blobBookSchema = new Schema({
  id_book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  id_blob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BlobBook = mongoose.model("BlobBook", blobBookSchema);
module.exports = BlobBook;
