const express = require("express");

const bookController = require("../controllers/book");

const router = express.Router();

router.get("/", bookController.getBooks);
router.get("/book/:bookId", bookController.getBook);

module.exports = router;
