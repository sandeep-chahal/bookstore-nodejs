var multer = require("multer");
const sharp = require("sharp");
const easyPath = require("../utils/easyPath")(__dirname);

//set Storage Engine
const storage = multer.diskStorage({
	destination: easyPath("../public/uploads"),
	filename: (req, file, cb) => {
		cb(null, Date.now() + "OMEN" + file.originalname);
	},
});
//check if file is image or not
const fileFilter = (req, file, callback) => {
	const isValidType = ["image/jpeg", "image/tiff", "image/png"].includes(
		file.mimetype
	);
	callback(null, isValidType);
};

// init upload
const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
}).single("img");

module.exports = (req, res, next) => {
	if (!req.user) next();
	upload(req, res, (err) => {
		if (err || !req.file) {
			const errors = [];
			if (err && err.code === "LIMIT_FILE_SIZE")
				errors.push("Please upload file with less than 5MB size!");
			else if (!req.file) errors.push("please upload a valid image file");
			req.fileErrors = errors;
		}
		if (req.file.buffer) {
			const fileName = String(Date.now()) + ".jpeg";
			sharp(req.file.buffer)
				.resize(600, 900)
				.toFormat("jpeg")
				.jpeg({ quality: 80 })
				.toFile(`public/uploads/${fileName}`);
			req.file.filename = fileName;
		}
		next();
	});
};
