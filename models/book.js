const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		minlength: 3,
		maxLength: 50,
		index: true,
	},
	img: String,
	author: {
		type: String,
		trim: true,
		required: true,
		minlength: 2,
		maxLength: 20,
		index: true,
	},
	summary: {
		type: String,
		minlength: [10, "book summary must be greater then 50 characters"],
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
	tag: {
		type: String,
	},
});

module.exports = mongoose.model("Book", bookSchema);
