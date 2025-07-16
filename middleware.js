const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make redirectUrl available in views
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);//All if are validated in a single line.
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
}
else {
    next();
}}
module.exports.validateReview = (req, res, next) => {
    console.log("Raw req.body:", req.body); // 🔍 ADD THIS LINE
    const { error, value } = reviewSchema.validate(req.body, {
        abortEarly: false,
        convert: true,
    });
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        req.body = value;
        next();
    }
};


module.exports.isReviewAuthor = async(req, res, next) => {
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the author of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}