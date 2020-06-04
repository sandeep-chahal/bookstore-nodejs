const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./env" });

const app = express();

//routes
app.get("/", (req, res, next) => {
	res.send("Hellooo!");
});

app.listen(process.env.PORT || 3000);
