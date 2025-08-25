const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
// const { type } = require("os"); // Remove this line

const listingSchema=new Schema({
    title:{
        type:String,
        required:true},          
    description:String,
    image:{
        filename:String,
        url:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String, // 'Point'
            enum: ['Point'],
            required: true // Geometry type is required
        },
        coordinates: {
            type: [Number],
            required: true // Coordinates are required
        }
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
          await Review.deleteMany({_id: {$in: listing.reviews}});
    }});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;