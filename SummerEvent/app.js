"use strict";

// ***** Import Dependencies ***** 
// done

const express = require("express"),
    path = require('path'),
    session = require('express-session'),
    validator = require('express-validator'),
    check = validator.check,
    validationResult = validator.validationResult,
    authorController = require("./controllers/authorController"),
    allorders = require("./controllers/allordersController"),
    loginController = require("./controllers/loginController"),
    mysql2 = require('mysql2'),
    app = express();

app.set("port", process.env.PORT || 8000);

// Setup database connection
// should use guest
const conn = mysql2.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "bingo123",
    insecureAuth: true,
    database: "summerevent"
});

// Setup Sessions
app.use(session({
    secret: "thisismyrandomkeysuperrandomsecret",
    resave: false,
    saveUninitialized: true
}));

// Express Body-Parser
app.use(express.urlencoded({ extended: false }));

// Set Path to public and views folders
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// ****** Validation Functions ********

var phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/;
var positiveNumber = /^[1-9][0-9]*$/;

function checkRegex(userInput, regex) {
    if (regex.test(userInput)) { return true; }
    else return false;
}

// Custom Validation for Phone Field
function customPhoneValidation(value) {
    if (!checkRegex(value, phoneRegex)) {
        throw new Error("Please enter correct phone format");
    }
    return true;
}

// Custom Validation for Lunch and Tickets Combined Field
function customLunchAndTicketValidation(lunch, { req }) {
    var tickets = req.body.tickets;
    if (!checkRegex(tickets, positiveNumber)) {
        throw new Error("Please select a positive number for tickets")
    }
    else {
        tickets = parseInt(tickets);
        if (tickets < 3 && lunch != 'yes') {
            throw new Error("Lunch is required if you purchase less than 3 tickets!")
        }
    }
    return true;
}


// ***** Setup Different Routes (pages) ***** 

app.get('/', function (req, res) {
    res.render('form'); // No need to add .ejs extension
});

app.post('/', [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please enter a valid email address!'),
    check('phone').custom(customPhoneValidation),
    check('lunch').custom(customLunchAndTicketValidation)
], (req, res) => {
    // Check for Errors
    const errors = validationResult(req);
    //console.log(`Errors: ${errors}`);
    if (!errors.isEmpty()) {
        res.render('form', { errors: errors.array() });
    }
    else {
        // If - No Errors, Display Output
        // read Values from form
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var postcode = req.body.postcode;
        var lunch = req.body.lunch;
        var tickets = req.body.tickets;
        var campus = req.body.campus;

        var subTotal = tickets * 20;
        if (lunch == 'yes') { subTotal += 15; }
        var tax = subTotal * 0.13;
        var total = subTotal + tax;

        var pageData = {
            name: name,
            email: email,
            phone: phone,
            postcode: postcode,
            lunch: lunch,
            tickets: tickets,
            campus: campus,
            subTotal: subTotal,
            tax: tax,
            total: total
        }

        // insert order into database
        // next concatenate in sql query
        try {
            //Insert query
            conn.query(`Insert into orders(name,email,phone,postcode, lunch, tickets,campus,subtotal,tax,total) 
                values(?,?,?,?,?,?,?,?,?,?);`,
                [name, email, phone, postcode, lunch, tickets, campus, subTotal, tax, total], (queryError, results) => {
                    // Process Query Errors or Results here
                    // result will contain return statement - like no.of rows affected
                    if (queryError) { console.log(`Insert Query Error: ${queryError}`); }
                    else {
                        console.log(`Insert: New Order created! :${results}`);
                        //display outputto the user
                        res.render('form', pageData);   // No need to add ,ejs extension
                    }
                });
        } catch (error) {
            res.status = 404;
            console.log(`Exception error: ${error}`);
        }
    }
});

// all orders - get Method
app.get('/allorders', allorders.renderIndex)
// Author Page - Get Method
app.get('/author', authorController.renderIndex);

// Sessions Using Logins

// Login Page - Get Method
app.get('/login', loginController.renderIndex);

// Login Page - Post Method
app.post('/login', loginController.renderResults);

// Logout Page - Get Method
app.get('/logout', authorController.logout);

// ***** Execute Application on Localhost - Server Listen to Port ***** 

app.listen(app.get("port"), () => {
    console.log(`Server running on http://localhost:${app.get('port')}`);
});