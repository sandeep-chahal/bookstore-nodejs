const Book = require("../models/book");
const catchAsyncError = require("../utils/cathcAsyncError");

exports.getBooks = catchAsyncError(async (req, res, next) => {
	const books = await Book.find();
	res.status(200).render("home", { books, current: "/" });
});
