const express = require('express');
const app = express();
const flash = require('connect-flash');
const path = require('path');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser("hhhhhh"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


//Session
const session = require('express-session');
const sessionOptions = {
        secret:"mysecretkey",
        resave: false,
        saveUninitialized: true}

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.message = req.flash('success'); // Make flash messages available in views   
    next();
});

// app.get('/reqcount', (req, res) => {
//     if(req.session.count){
//         req.session.count++;    
//     }
//     else{
//         req.session.count = 1;
//     }
// res.send(`Session has been sent ${req.session.count} times!`);
// });
app.get("/register", (req, res) => {
    let {name}=req.query;
    req.session.name = name; // Store the name in the session
    req.flash('success', `Welcome, ${name}!`); // Flash message
    res.redirect("/hello");   
});
app.get("/hello", (req, res) => {
    res.render("page.ejs",{name:req.session.name});
})











// //SignedCookie
// app.get("/getSignedCookie", (req, res) => {
//     res.cookie("name", "John Doe", { signed: true });
//     res.send('Signed cookie has been set!');
// });
// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);

// });
// app.get('/getcookies', (req, res) => {
//     res.cookie("hi","cookie");
//     res.send('Cookies have been set!');
// });
// app.get('/greet', (req, res) => {
//     let {name="Anonymous"}=req.cookies
//     res.send(`Hello, ${name}!`);

// });
// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send('Welcome to the home page!');
// });  
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});