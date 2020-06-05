const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const easyPath = require("./utils/easyPath")(__dirname);

const app = express();

//setting view engine
app.set("view engine", easyPath("pug"));
app.set("views", easyPath("./views"));
//serving static files
app.use(express.static(easyPath("./public")));

//routes
app.get("/", (req, res, next) => {
	res.send("Hellooo!");
});

// connect to db and start the server
console.log(process.env.MONGO_URI);
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT);
	})
	.catch((err) => {
		console.log(err);
	});
