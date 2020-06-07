const { check, body } = require("express-validator");

const User = require("../models/user");

module.exports = (type) => {
	switch (type) {
		case "signup":
			return signupValidator;
			break;
		case "login":
			return loginValidator;
			break;
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
		.isLength({ max: [30, "Email is too long!"] })
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
	check("name", "Name must be min 2 and max 12 char long!").trim().isLength({
		min: 2,
		max: 12,
	}),
];
