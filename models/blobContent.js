const mongoose = require("mongoose");
const { Schema } = mongoose;

const blobContentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const BlobContent = mongoose.model("BlobContent", blobContentSchema);
module.exports = BlobContent;
