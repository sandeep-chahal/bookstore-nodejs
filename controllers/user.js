const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const easyPath = require("../utils/easyPath")(__dirname);
const deleteFile = require("../utils/deleteFile");
const catchAsyncError = require("../utils/cathcAsyncError");

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

const detectErrors = (req, res) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		res.json({
			error: true,
			errors: error.array().map((err) => err.msg),
		});
		return true;
	}
	return false;
};

exports.getLogin = (req, res, next) => {
	if (req.user) return res.redirect("/");
	res.status(200).render("login", { current: "auth" });
};
exports.getSignup = (req, res, next) => {
	if (req.user) return res.redirect("/");
	res.status(200).render("signup", { current: "auth" });
};

exports.getDashboard = catchAsyncError(async (req, res, next) => {
	if (!req.user) return res.redirect("/login");
	const user = await User.findById(req.user._id)
		.select("selling")
		.populate("selling", "img quantity _id")
		.sort("date");
	res.status(200).render("dashboard", {
		current: "dashboard",
		loggedIn: Boolean(req.user),
		books: user.selling,
	});
});
exports.getSell = (req, res, next) => {
	if (!req.user) return res.redirect("/login");
	res
		.status(200)
		.render("sell", { current: "dashboard", loggedIn: Boolean(req.user) });
};

exports.postLogin = catchAsyncError(async (req, res, next) => {
	//check for validation error
	if (detectErrors(req, res)) return;

	const email = req.body.email;
	const password = req.body.password;

	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password)))
		return res.status(400).json({
			error: true,
			message: "Wrong Credentials!",
		});
	const token = generateToken(user._id);
	res.cookie("jwt", token);
	res.status(200).json({ error: false, message: "success" });
});

exports.postSignup = catchAsyncError(async (req, res, next) => {
	//check for validation error
	if (detectErrors(req, res)) return;

	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	const encPassword = await bcrypt.hash(password, 12);
	const user = await User.create({ name, email, password: encPassword });

	const token = generateToken(user._id);
	res.cookie("jwt", token);
	res.status(200).json({ error: false, message: "success" });
});
exports.logout = (req, res, next) => {
	res.cookie("jwt", "");
	res.redirect("/");
};

exports.sell = catchAsyncError(async (req, res, next) => {
	if (!req.user) return res.status(401).redirect("/login");
	//getting and sending errors
	if (handleSellErrors(req, res)) return;

	const book = await Book.create({
		...req.body,
		seller: {
			name: req.user.name,
			id: req.user._id,
		},
		img: `/uploads/${req.file.filename}`,
	});
	await User.findByIdAndUpdate(req.user._id, {
		$push: { selling: book._id },
	});
	res.status(201).redirect("/book/" + book._id);
});

function handleSellErrors(req, res) {
	const error = validationResult(req);
	if (!error.isEmpty() || req.fileErrors) {
		let errors = [];

		if (!error.isEmpty()) errors = [...error.array().map((err) => err.msg)];
		if (req.fileErrors) errors = [...errors, ...req.fileErrors];
		console.log(errors);

		if (!error.isEmpty())
			deleteFile(easyPath(`../public/uploads/${req.file.filename}`));
		res.status(400).render("sell", {
			current: "sell",
			loggedIn: true,
			values: req.body,
			errors: errors,
		});
		return true;
	}
	return false;
}

exports.remove = catchAsyncError(async (req, res) => {
	const bookId = req.query.bookId;

	const book = await Book.findOneAndRemove({
		_id: bookId,
		"seller.id": req.user._id,
	});
	deleteFile(easyPath(`public${book.img}`).replace("controllers", ""));
	await req.user.update({ $pull: { selling: bookId } });
	res.json({ message: "success" });
});

exports.restock = catchAsyncError(async (req, res) => {
	if (detectErrors(req, res)) return;

	const bookId = req.query.bookId;
	const quantity = parseInt(req.query.quantity);
	if (quantity < 0 || isNaN(quantity)) {
		return res.json({ message: "error" });
	}

	await Book.findOneAndUpdate(
		{ _id: bookId, "seller.id": req.user._id },
		{ quantity: quantity }
	);
	res.json({ message: "success" });
});

exports.addToCart = catchAsyncError(async (req, res, next) => {
	if (!req.user) return res.status(401).redirect("/");

	const bookId = req.body.bookId;

	const alreadyInCart = await User.findOne({
		_id: req.user._id,
		cart: {
			$elemMatch: {
				id: bookId,
			},
		},
	}).select("_id");
	// update  existing
	if (alreadyInCart)
		await User.findById(req.user._id).updateOne(
			{ "cart.id": bookId },
			{
				$inc: {
					"cart.$.buyQuantity": 1,
				},
			},
			(err) => {
				console.log(err);
			}
		);
	// add new
	else
		await User.findById(req.user._id).updateOne(
			{
				cart: {
					$not: {
						$elemMatch: {
							id: bookId,
						},
					},
				},
			},
			{
				$push: {
					cart: {
						id: bookId,
						buyQuantity: 1,
					},
				},
			},
			(err) => {
				console.log(err);
			}
		);

	res.json({ message: "success" });
});

const getCartItems = catchAsyncError(async (id) => {
	let books = await User.findById(id)
		.select("cart")
		.populate("cart.id", "name price quantity");
	let totalPrice = 0;
	books = books.cart
		? books.cart
				.map((item) => {
					if (!item || !item.id) return null;
					totalPrice +=
						item.id.price *
						(item.id.quantity < item.buyQuantity
							? item.id.quantity
							: item.buyQuantity);
					return {
						name: item.id.name,
						bookId: item.id._id,
						price: item.id.price,
						cartId: item._id,
						buyQuantity:
							item.id.quantity < item.buyQuantity
								? item.id.quantity
								: item.buyQuantity,
					};
				})
				.filter((item) => item)
		: [];
	return { books, totalPrice };
});

exports.getCart = catchAsyncError(async (req, res, next) => {
	if (!req.user) return res.status(401).redirect("/login");
	const cart = await getCartItems(req.user._id);
	res.render("cart", { ...cart, loggedIn: true, current: "cart" });
});

exports.removeFromCart = catchAsyncError(async (req, res, next) => {
	const bookId = req.body.bookId;

	await User.findByIdAndUpdate(req.user._id, {
		$pull: {
			cart: {
				id: bookId,
			},
		},
	});

	res.json({ message: "success" });
});

exports.checkout = catchAsyncError(async (req, res, next) => {
	if (!req.user) return res.status(401).redirect("/login");

	const { books } = await getCartItems(req.user._id);

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		customer_email: req.user.email,
		line_items: books.map((book) => {
			return {
				name: book.name,
				amount: book.price * 100,
				currency: "usd",
				quantity: book.buyQuantity,
			};
		}),
		mode: "payment",
		success_url: `${req.protocol}://${req.get(
			"host"
		)}/ordered?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${req.protocol}://${req.get("host")}/cart`,
	});

	res.json({ session });
});

exports.orderSuccess = catchAsyncError(async (req, res, next) => {
	const { books } = await getCartItems(req.user._id);
	books.forEach(async (book) => {
		await Book.findByIdAndUpdate(book.bookId, {
			$inc: {
				quantity: -parseInt(book.buyQuantity),
			},
		});
	});

	await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });
	res.redirect("/cart");
});
