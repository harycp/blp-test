const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../middlewares/multer");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/books", authMiddleware, bookController.index);
router.get("/books/create", authMiddleware, bookController.create);
router.post(
  "/books",
  authMiddleware,
  upload.single("file"),
  bookController.store
);

router.get("/books/:id", authMiddleware, bookController.show);
router.get("/books/:id/edit", authMiddleware, bookController.edit);
router.put("/books/:id", authMiddleware, bookController.update);
router.delete("/books/:id", authMiddleware, bookController.delete);
module.exports = router;
