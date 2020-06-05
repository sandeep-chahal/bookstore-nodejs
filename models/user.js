const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, "please enter your name!"],
		minlength: [3, "name must be greater then 3 characters"],
		maxLength: [30, "name must be less then 30 characters"],
	},
	selling: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
});

module.exports = mongoose.model("User", userSchema);
