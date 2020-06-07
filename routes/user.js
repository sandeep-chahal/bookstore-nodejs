const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);
router.post("/login", userController.postLogin);
router.post("/signup", userController.postSingup);

module.exports = router;
