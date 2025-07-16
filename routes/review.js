const express = require('express');
const router = express.Router({mergeParams: true}); // mergeParams allows us to access params from the parent rout
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
//validateReview function to validate the review data
const reviewsController = require('../controllers/reviews.js');
//Reviews
// Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewsController.createReview));
// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.destroyReview));


module.exports = router;