const User = require('../models/user.js');


module.exports.renderSignup = (req,res)=>{
    res.render("../views/users/signup.ejs");
}


module.exports.signup = async(req,res)=>{
 try{
      let {username,email,password}=req.body;
   let newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Successfully signed up!");
    res.redirect("/listings");
    });
    
 }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
 }

}

module.exports.renderLogin = (req,res)=>{
    res.render("../views/users/login.ejs");
}

module.exports.login = async(req,res)=>{
   req.flash("success","Welcome back!");
   res.redirect(res.locals.redirectUrl || "/listings" ); // Redirect to the original URL or listings
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
}