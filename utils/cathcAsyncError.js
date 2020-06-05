module.exports = (fn) => {
	return fn(req, res, next).catch((err) => {
		next(err);
	});
};
