const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignUp)
.post(wrapAsync(userController.signUp));

router.route("/login")
.get(userController.renderLogIn)
.post(saveRedirectURL, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;

// router.get("/signup", userController.renderSignUp);

// router.post("/signup", wrapAsync(userController.signUp));

// router.get("/login", userController.renderLogIn);

// router.post("/login", saveRedirectURL, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), wrapAsync(userController.login));



