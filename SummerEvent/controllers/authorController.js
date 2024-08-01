"use strict";

exports.renderIndex = (req, res) => {
    // If Session Exits, then access /author Page
    if(req.session.userLoggedIn) {
        res.render('author', {
            studentName : "admin",
            studentNumber : "12345"
        });
    }
    else {
        res.redirect('/login');
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        console.log("Session Destroyed");
    });
    res.render('login', {errors: 'Successfully Logged Out!'});
};
