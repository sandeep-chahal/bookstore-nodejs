const User = require("../models/user");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

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

exports.postSingup = async (req, res, next) => {
	try {
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
