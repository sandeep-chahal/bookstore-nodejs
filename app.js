const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./env" });

const app = express();

//routes
app.get("/", (req, res, next) => {
	res.send("Hellooo!");
});

// connect to db and start the server
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT);
	})
	.catch((err) => {
		console.log(err);
	});
