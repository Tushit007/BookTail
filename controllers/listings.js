const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index=async (req, res)=>{
  const allListings= await Listing.find({})
    .populate({ // Populate reviews for each listing
        path: 'reviews',
        populate: { // And populate the author for each review
            path: 'author'
        }
    })
    .populate('owner'); // Populate the owner of the listing
  res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
  const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
}


module.exports.createListing = async (req, res, next) => {
    console.log("--- Inside createListing Controller ---");
    console.log("req.user at start of createListing:", req.user ? req.user.username : "No user in req.user");
    console.log("req.body:", req.body); // <--- ADD THIS LINE
    console.log("req.file:", req.file); // <--- ADD THIS LINE (for image upload)

    if (!req.user) {
        req.flash("error", "Error: User data missing for listing creation.");
        return res.redirect("/login");
    }
    
    // Multer stores single uploaded file in req.file, not req.files
    // Let's ensure req.file exists before trying to access its properties
    if (!req.file) {
        console.error("Image upload failed: req.file is missing!");
        req.flash("error", "Image upload failed. Please try again.");
        return res.redirect('/listings/new'); // Or handle appropriately
    }

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    console.log("Geocoding Response Body:", response.body);
    console.log("Geocoding Features:", response.body.features);

    // Guard against empty geocoding features
    if (!response.body.features || response.body.features.length === 0) {
        console.error("Geocoding failed: No features returned for location:", req.body.listing.location);
        req.flash("error", "Could not find coordinates for the provided location. Please try a more specific address.");
        return res.redirect('/listings/new');
    }

    // Access req.file directly for single file upload
    let url = req.file.path;       
    let filename = req.file.filename; 
    console.log("Image URL:", url, "Filename:", filename);

    const newListing = new Listing(req.body.listing);
    console.log("New Listing object created:", newListing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log("Listing saved:", savedListing);
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageURL=listing.image.url; 
  originalImageURL=originalImageURL.replace("/upload", "/upload/w_300/"); 
  res.render("listings/edit.ejs",{listing,originalImageURL});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); // Ensure updateListing is defined in controller
    if(req.file){ // Check if a new file was uploaded
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image={url,filename};
       await listing.save();
    }
   req.flash("success","Successfully updated the listing!");
   res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListings=await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
    req.flash("success","Successfully deleted the listing!")
    res.redirect("/listings");
}