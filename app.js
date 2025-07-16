if(process.env.NODE_ENV !== "production") {     
require('dotenv').config();}

const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const User = require('./models/user.js'); // Assuming you have a User model defined in models
const session = require('express-session');
const userRouter = require('./routes/user.js'); // Assuming you have a user route defined in routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const flash=require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
 // Assuming you have a User model defined in models

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOptions = {
    secret:"SecretKey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 1000 * 60 * 60 * 24, // 7 days
        maxAge: 7 * 1000 * 60 * 60 * 24 ,// 7 days
        httpOnly: true, // Helps prevent XSS attacks
    }
}; 
app.get("/",(req,res)=>{
    res.send("hii i m working");
})

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use the LocalStrategy for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(3030,()=>{
    console.log("hiii");
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // Make current user available in all views

    if (res.locals.success.length > 0) {
        console.log("Flash success:", res.locals.success);
    }
    if (res.locals.error.length > 0) {
        console.log("Flash error:", res.locals.error);
    }


    next();
});

// app.get("/fakeUser", async(req, res) => {
//     const fakeuser = new User({ email:"student@gmail.com",
//     username: "student"
//     });
//     const newUser = await User.register(fakeuser, "student123");
//     res.send(newUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE not found"))
})

app.use((err,req,res,next)=>{
 let{status=500,message="Custom Error"}=err;
 res.status(status).render("Error.ejs",{message});

})

