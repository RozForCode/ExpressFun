"use strict";

exports.renderIndex = (req, res) => {
    res.render('login');
};

exports.renderResults = (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    if (username == "admin" && password == "sysadmin") {
        req.session.username = username;
        req.session.userLoggedIn = true;
        console.log("Session Created");
        res.redirect('/author');
    }
    else {
        res.render('login', { errors: "Sorry Login Failed. Please Try Again!" });
    }
};
