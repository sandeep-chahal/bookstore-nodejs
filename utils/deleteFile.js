const fs = require("fs");

module.exports = (filepath) => {
	try {
		fs.unlink(filepath, (err) => {
			console.log(err);
		});
	} catch (err) {
		console.log(err.message, err);
	}
};
