const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
dotenv.config({ path: ".env" });

const easyPath = require("./utils/easyPath")(__dirname);
const bookRoute = require("./routes/book");
const userRoute = require("./routes/user");

const app = express();

//setting view engine
app.set("view engine", "pug");
app.set("views", easyPath("./views"));
//serving static files
app.use(express.static(easyPath("./public")));
//parsing json data
app.use(express.json());
// cookie parse
app.use(cookieParser());

//routes
app.use(bookRoute);
app.use(userRoute);

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
