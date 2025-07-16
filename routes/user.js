const express= require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js")
router.route("/signup")
  .get(userController.renderSignup) // optional - render form page
  .post(wrapAsync(userController.signup)); // handle form submission

router.route("/login")
  .get(userController.renderLogin) // optional - render form page
  .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login)); // handle form submission
  
router.get("/logout",userController.logout)
module.exports=router;