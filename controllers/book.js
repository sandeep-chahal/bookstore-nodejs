const Book = require("../models/book");
const catchAsyncError = require("../utils/cathcAsyncError");

exports.getBooks = catchAsyncError(async (req, res, next) => {
	const books = await Book.find()
		.limit(10)
		.select("-seller -author -summary -date -tags");
	console.log(books[0]);
	res.status(200).render("home", { books, current: "/" });
});
exports.getBook = catchAsyncError(async (req, res, next) => {
	const book = await Book.findById(req.params.bookId);
	res.status(200).render("book", { book, current: "/book" });
});
