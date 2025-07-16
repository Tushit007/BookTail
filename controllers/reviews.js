const Review = require('../models/review');
const Listing = require('../models/listing');
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);// Create a new review instance with the data from the request body
   // Associate the review with the listin
    
    newReview.author=req.user._id; // Set the author of the review to the current user
    console.log(newReview);
    // Check if the user has already reviewed this listing
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log("Deleted");
    req.flash("success","Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}