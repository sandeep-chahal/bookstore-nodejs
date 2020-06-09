const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const easyPath = require("../utils/easyPath")(__dirname);
const deleteFile = require("../utils/deleteFile");

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

exports.getDashboard = async (req, res, next) => {
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
};
exports.getSell = (req, res, next) => {
	if (!req.user) return res.redirect("/login");
	res
		.status(200)
		.render("sell", { current: "dashboard", loggedIn: Boolean(req.user) });
};

exports.postLogin = async (req, res, next) => {
	try {
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
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: true,
			message: "Something went wrong!",
		});
	}
};

exports.postSignup = async (req, res, next) => {
	try {
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
	} catch (err) {
		console.log(err);
		res.status(500).render({
			errors: ["Something went wrong!"],
		});
	}
};

exports.logout = (req, res, next) => {
	res.cookie("jwt", "");
	res.redirect("/");
};

exports.sell = async (req, res, next) => {
	try {
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
	} catch (err) {
		console.log("error", err.message);
		res.status(500).json({ error: true, errors: ["something went wrong!"] });
	}
};

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

exports.remove = async (req, res) => {
	try {
		const bookId = req.query.bookId;

		await Book.findOneAndRemove({ _id: bookId, "seller.id": req.user._id });
		await req.user.update({ $pull: { selling: bookId } });

		res.json({ message: "success" });
	} catch (err) {
		console.log(err);
	}
};

exports.restock = async (req, res) => {
	console.log("object");
	try {
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
	} catch (err) {
		console.log(err);
	}
};
