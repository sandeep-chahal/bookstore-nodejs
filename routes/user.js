const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const validator = require("../middlewares/validator");
const authentication = require("../middlewares/authentication");

router.get("/login", authentication, userController.getLogin);
router.get("/signup", authentication, userController.getSignup);
router.post("/login", validator("login"), userController.postLogin);
router.post("/signup", validator("signup"), userController.postSignup);
router.get("/logout", userController.logout);
router.get("/dashboard", authentication, userController.getDashboard);
router.get("/sell", authentication, userController.getSell);
router.post("/sell", authentication, userController.sell);

module.exports = router;
