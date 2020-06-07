const Book = require("../models/book");
const catchAsyncError = require("../utils/cathcAsyncError");

exports.getBooks = catchAsyncError(async (req, res, next) => {
	const books = await Book.find()
		.limit(10)
		.select("-seller -author -summary -date -tags");
	res
		.status(200)
		.render("home", { books, current: "", loggedIn: Boolean(req.user) });
});
exports.getBook = catchAsyncError(async (req, res, next) => {
	const book = await Book.findById(req.params.bookId);
	res
		.status(200)
		.render("book", { book, current: "book", loggedIn: Boolean(req.user) });
});
