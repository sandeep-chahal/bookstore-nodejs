const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: [true, "Email is already in use!"],
		required: [true, "Enter your email!"],
		maxLength: [50, "Email is too long!"],
	},
	name: {
		type: String,
		trim: true,
		required: [true, "please enter your name!"],
		minlength: [3, "name must be greater then 3 characters"],
		maxLength: [30, "name must be less then 30 characters"],
	},
	password: {
		type: String,
		required: [true, "Please enter password!"],
		maxlength: [50, "password too long!"],
	},
	selling: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("User", userSchema);
