const User = require("../models/users");


userControllers = {};

userControllers.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

userControllers.userRegister = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err)
                return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

userControllers.renderLoginForm = (req, res) => {
    res.locals.previousUrl = req.session.returnTo
    res.render('users/login');
};

userControllers.login = (req, res) => {
    req.flash('success', 'Welcome to YelpCamp');
const redirectUrl = (res.locals.returnTo || res.locals.previousUrl) || "/campgrounds"; 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

userControllers.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succesfully Logged Out');
        res.redirect('/campgrounds');
    })
};

module.exports = userControllers;