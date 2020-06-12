const { check, body } = require("express-validator");

const User = require("../models/user");

module.exports = (type) => {
	switch (type) {
		case "signup":
			return signupValidator;
		case "login":
			return loginValidator;
		case "sell":
			return sellValidator;
	}
};

const loginValidator = [
	check("email", "Wrong Credentials!").isEmail().trim().normalizeEmail(),
	check("password", "Wrong Credentials!").trim().isLength({ min: 8, max: 16 }),
];

const signupValidator = [
	check("email", "Invalid Email!")
		.isEmail()
		.trim()
		.isLength({ max: 30 })
		.normalizeEmail(),
	body("Email").custom((email) => {
		return User.findOne({ email }).then((user) => {
			if (user) {
				return Promise.reject(
					"This email is already registred with another account!"
				);
			}
		});
	}),
	check("password", "Password must be min 8 and max 16 char long!")
		.trim()
		.isLength({
			min: 8,
			max: 16,
		}),
	check("name", "Name must be min 2 and max 20 char long!").trim().isLength({
		min: 2,
		max: 20,
	}),
];

const sellValidator = [
	check("name", "Book name must be between 3 and 50 char long!").isLength({
		min: 3,
		max: 50,
	}),
	body(
		"author",
		"Book Author name must be between 2 and 20 char long! "
	).isLength({
		min: 2,
		max: 20,
	}),
	body("summary", "Summary must be between 10 and 700 char long!").isLength({
		min: 10,
		max: 700,
	}),
	body("price", "Price must be betwenn $1 and $100!").isNumeric().isInt({
		min: 1,
		max: 100,
	}),
	body("quantity", "Quantity must be more than 0!").isNumeric().isInt({
		min: 1,
	}),
	body(
		"tag",
		"Please enter a tag with betwenn 3 and 15 char long, i.e fiction"
	).isLength({
		min: 3,
		max: 15,
	}),
];
