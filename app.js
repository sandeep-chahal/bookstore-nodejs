const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var multer = require("multer");
dotenv.config({ path: ".env" });

const easyPath = require("./utils/easyPath")(__dirname);
const bookRoute = require("./routes/book");
const userRoute = require("./routes/user");

const app = express();

//sset Storage Engine
const storage = multer.diskStorage({
	destination: easyPath("./public/uploads"),
	filename: (req, file, cb) => {
		cb(null, Date.now() + ".jpg");
	},
});
// init upload
const upload = multer({
	storage,
}).single("img");

//setting view engine
app.set("view engine", "pug");
app.set("views", easyPath("./views"));
//serving static files
app.use(express.static(easyPath("./public")));
//parsing json and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parse
app.use(cookieParser());

//routes
app.use(bookRoute);
app.use(upload, userRoute);

// error handler
app.use((err, req, res, next) => {
	console.log("-------------------");
	console.log(err, err.message);
});

// connect to db and start the server
mongoose
	.connect(process.env.MONGO_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(() => {
		app.listen(process.env.PORT || 3000);
	})
	.catch((err) => {
		console.log(err);
	});
