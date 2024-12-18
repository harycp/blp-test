const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../middlewares/multer"); // upload file middleware
const authMiddleware = require("../middlewares/authMiddleware");

// CRUD Operations untuk Buku
router.get("/books", authMiddleware, bookController.index); // Menampilkan daftar buku
router.get("/books/create", authMiddleware, bookController.create); // Menampilkan form untuk menambah buku
router.post(
  "/books",
  authMiddleware,
  upload.single("file"),
  bookController.store
); // Menambahkan buku baru
router.get("/books/:id", authMiddleware, bookController.show);
router.get("/books/:id/edit", authMiddleware, bookController.edit);
router.put("/books/:id", authMiddleware, bookController.update);
router.delete("/books/:id", authMiddleware, bookController.delete);

module.exports = router;
