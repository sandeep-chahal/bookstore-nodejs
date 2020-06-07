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

exports.postLogin = catchAsyncError(async (req, res, next) => {
	console.log(req.body);
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
