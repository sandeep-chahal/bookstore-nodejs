const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			req.user = null;
			return next();
		}
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		if (!decodedToken || !decodedToken.id) {
			req.user = null;
			return next();
		}
		const user = await User.findById(decodedToken.id).select("_id name email");
		if (!user) {
			req.user = null;
			return next();
		}
		req.user = user;
		next();
	} catch (err) {
		console.log(err.message);
		req.user = null;
		next();
	}
};
