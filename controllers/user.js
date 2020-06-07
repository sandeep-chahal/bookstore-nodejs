const User = require("../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

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
		res.status(500).json({
			error: true,
			message: "Something went wrong!",
		});
	}
};

exports.logout = (req, res, next) => {
	res.cookie("jwt", "");
	res.redirect("/");
};
