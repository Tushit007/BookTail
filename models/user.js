const mongoose=require("mongoose");
const { type } = require("os");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});
userSchema.plugin(passportLocalMongoose); // This plugin adds username and password fields to the schema and provides methods for authentication
const User=mongoose.model("User",userSchema);
module.exports=User;