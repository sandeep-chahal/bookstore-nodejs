const express = require("express");

const bookController = require("../controllers/book");
const authorization = require("../middlewares/authentication");

const router = express.Router();

router.get("/", authorization, bookController.getBooks);
router.get("/book/:bookId", authorization, bookController.getBook);
router.get("/seller/:sellerId", authorization, bookController.getUserBook);
router.get("/category/:tag", authorization, bookController.getCategoryBooks);
router.post("/search", authorization, bookController.search);

module.exports = router;
