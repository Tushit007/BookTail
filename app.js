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
const MongoStore = require('connect-mongo');
const userRouter = require('./routes/user.js'); // Assuming you have a user route defined in routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const flash=require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbURL=process.env.ATLAS_DB_URL; // Correct variable name from .env
main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbURL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); // Correct path for static files

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:"SecretKey"
    },
    touchAfter:24*3600
});
store.on("error",()=>{
    console.log("Error in MONGO SESSION",err)
})
const sessionOptions = {
    store,
    secret:"SecretKey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,             // 7 days in milliseconds
        httpOnly: true, // Helps prevent XSS attacks
    }
}; 

app.use(session(sessionOptions));
app.use(flash());

// Passport middleware should come after session middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use the LocalStrategy for authentication

// Use the default serializeUser and deserializeUser methods provided by passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); // Keep this as the *only* deserializeUser call

app.listen(3030,()=>{
    console.log("Server is running on port 3030"); // More descriptive log
})

// This middleware must come AFTER passport.session() and passport.deserializeUser()
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Make current user available in all views
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    // Optional: for debugging flash messages, remove in production
    if (res.locals.success.length > 0) {
        console.log("Flash success:", res.locals.success);
    }
    if (res.locals.error.length > 0) {
        console.log("Flash error:", res.locals.error);
    }
    next();
});

// app.get("/fakeUser", async(req, res) => { /* ... */ }); // Commented out fake user creation

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.js

// ... (other code) ...

// app.js

// ... (other code) ...

app.all("*",(req,res,next)=>{
   next(new ExpressError("PAGE not found", 404));
});

// Global Error Handling Middleware
app.use((err,req,res,next)=>{
    // Correctly extract statusCode and message from the ExpressError object
    // Default to 500 and "Something Went Wrong!" if they are missing
    let { statusCode = 500, message = "Something Went Wrong!" } = err; 
    
    // Ensure `err.message` is set if it's not already,
    // as ExpressError might only set `this.message` implicitly via `super(message)`
    if (!message) message = "Something Went Wrong!"; 

    res.status(statusCode).render("Error.ejs",{message});
});

// ... (rest of your app.js) ...
