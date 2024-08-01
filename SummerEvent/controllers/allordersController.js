"use strict";

const mysql2 = require('mysql2')
// setup db connection again 
const conn = mysql2.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "bingo123",
    insecureAuth: true,
    database: "summerevent"
});
exports.renderIndex = (req, res) => {
    // If Session Exits, then access /author Page
    if (req.session.userLoggedIn) {

        // query to display the orders
        conn.query(`
                select * from orders
                `, (queryError, results) => {
            if (queryError) { console.log(queryError) }
            else { console.log(results); res.render('allorders', { orders: results }) }
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
    res.render('login', { errors: 'Successfully Logged Out!' });
};
