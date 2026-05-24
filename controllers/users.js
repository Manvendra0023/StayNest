const User = require("../models/user");
const { sendWelcomeEmail } = require("../utils/mailer");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res, next) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // Send welcome email (non-blocking)
        sendWelcomeEmail({ email, username }).catch(() => {});
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to StayNest!");
            return res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    return res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to StayNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};




module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        return res.redirect("/listings");
    });
};
