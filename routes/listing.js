const express = require('express');
const router = express.Router();   
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const listingController =require("../controllers/listings.js");
// const { li } = require('framer-motion/client');
 const multer = require('multer');
 const {storage, cloudinary} = require('../cloudConfig.js'); // Import the cloudinary configuration
 const upload = multer({ storage }); // Set the destination for uploaded files


router.route("/")
//Index route--
.get(wrapAsync(listingController.index))
//Create Route--
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing))

//New Route--
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
//Show Route--
.get(wrapAsync(listingController.showListing))
//Update Route--
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
//Delete Route--
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)) 



//Edit Route--
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;