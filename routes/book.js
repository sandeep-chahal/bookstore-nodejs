const express = require("express");

const bookController = require("../controllers/book");
const authorization = require("../middlewares/authentication");

const router = express.Router();

router.get("/", authorization, bookController.getBooks);
router.get("/book/:bookId", authorization, bookController.getBook);

module.exports = router;
