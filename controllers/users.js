const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
   res.render("./users/signup.ejs")
}

module.exports.signUp = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
       
    } catch(error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
   
}

module.exports.renderLogIn = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!")
    let redirectURL = res.locals.redirectURL;
    if(redirectURL) {
        res.redirect(redirectURL);
    } else {
        res.redirect("/listings");
    }
    
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out of WanderLust!");
        res.redirect("/listings");
    });
}