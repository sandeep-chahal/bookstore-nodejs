const User = require("../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const catchAsyncError = require("../utils/cathcAsyncError");

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

exports.getLogin = (req, res, next) => {
	res.status(200).render("login");
};
exports.getSignup = (req, res, next) => {
	res.status(200).render("signup");
};

exports.postLogin = async (req, res, next) => {
	try {
		// checking validation errors
		const error = validationResult(req);
		console.log(error.array());
		if (!error.isEmpty()) {
			return res.json({
				error: true,
				errors: error.array().map((err) => err.msg),
			});
		}
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
		// checking validation errors
		const error = validationResult(req);
		console.log(error.array());
		if (!error.isEmpty()) {
			return res.json({
				error: true,
				errors: error.array().map((err) => err.msg),
			});
		}

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
