const express = require("express");

const bookController = require("../controllers/book");

const router = express.Router();

router.get("/", bookController.getBooks);

module.exports = router;
