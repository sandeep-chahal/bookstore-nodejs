const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		maxLength: 30,
	},
	name: {
		type: String,
		trim: true,
		required: true,
		minlength: 2,
		maxLength: 12,
	},
	password: {
		type: String,
		required: true,
	},
	selling: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
	cart: [
		{
			id: { type: mongoose.Types.ObjectId, ref: "Book" },
			buyQuantity: Number,
		},
	],
});

module.exports = mongoose.model("User", userSchema);
