const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const validator = require("../middlewares/validator");

router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);
router.post("/login", validator("login"), userController.postLogin);
router.post("/signup", validator("signup"), userController.postSignup);

module.exports = router;
