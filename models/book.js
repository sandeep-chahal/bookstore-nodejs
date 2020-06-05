const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, "please enter book name!"],
		minlength: [3, "book name must be greater then 3 characters"],
		maxLength: [50, "book name must be less then 50 characters"],
		index: true,
	},
	author: {
		type: String,
		trim: true,
		required: [true, "please enter auther name!"],
		minlength: [2, "author name must be greater then 2 characters"],
		maxLength: [30, "author name must be less then 30 characters"],
		index: true,
	},
	summary: {
		type: String,
		minlength: [50, "book summary must be greater then 50 characters"],
		maxlength: [700, "book summary must be less then 700 characters"],
	},
	price: {
		type: Number,
		required: [true, "no price is given"],
		validate: {
			validator: function (val) {
				return val > 0 && val <= 100;
			},
			message: "price must be greater then $0 and less then $100",
		},
	},
	quantity: {
		type: Number,
		required: [true, "please enter book quantity"],
		validate: {
			validator: function (val) {
				return val >= 0;
			},
			message: "quanity can't be negetive!",
		},
	},
	seller: {
		name: {
			type: String,
			required: [true, "seller name not given"],
		},
		id: {
			type: mongoose.Types.ObjectId,
			required: [true, "objectid not given"],
		},
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Book", bookSchema);
