"use strict";
const express = require('express'),
    validator = require('express-validator'),
    path = require('path'),
    mysql2 = require('mysql2'),
    check = validator.check,
    validationResult = validator.validationResult,
    app = express();

// database configuration
//cpanel
// const conn = mysql2.createPool({
//     user: 'johnavro_johnavro',
//     connectionLimit: 2,
//     database: 'johnavro_assignment4',
//     insecureAuth: true,
//     password: 'BingoBingo@312',
//     host: 'localhost'
// }
// )
//local pc
const conn = mysql2.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "bingo123",
    insecureAuth: true,
    database: "summerevent"
});


// env set methods 
/* 
When you submit a form using the POST method, the form data is encoded as key-value pairs
 and sent in the body of the request. This encoding is called application/x-www-form-urlencoded.
Setting urlencoded to true tells body-parser to parse this type of data and convert it
 into a JavaScript object, which you can then access via req.body
*/
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.set("port", 8001);
app.set("view engine", 'ejs')

// get methods
app.get('/', (req, res) => {
    res.render('form');
})
app.get('/allorders', (req, res) => {
    res.render('allOrders');
})

// validation functions


function customPhoneValidation(userinput) {
    const phoneRegex = /^[0-9]{3}\-?[0-9]{3}\-?[0-9]{4}$/;
    if (!phoneRegex.test(userinput)) {
        throw new Error("Please provide valid phone number")
    }
    return true;
}
function customOrder(value, { req }) {
    const { HashBrown, Bagel, Coffee } = req.body;
    if (HashBrown == 0 && Bagel == 0 && Coffee == 0) {
        throw new Error("You don't have any item selected.")
    }
    return true;
}




// validate and process form submission;
app.post('/submit', [
    check('name').notEmpty().withMessage("name is required"),
    check('city').notEmpty().withMessage("city is required"),
    check('province').notEmpty().withMessage("province is required"),
    check('address').notEmpty().withMessage("address is required"),
    check('email').isEmail().withMessage('Please enter a valid email.'),
    check('phone').custom(customPhoneValidation),
    check('HashBrown').custom(customOrder)
], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        let errArr = errors.array();
        const items = [];
        for (let i = 0; i < errArr.length; i++) {
            items.push(errArr[i].msg)
        }
        res.render('receipt', { items })
    } else {
        const items = Object.keys(req.body).map(key => (req.body)[key]);
        let subtotal = (Number(items[6]) * 5 + Number(items[7]) * 2 + Number(items[8]) * 3);
        let tax = Number((subtotal * 0.12).toFixed(2));

        items[9] = `Subtotal: ${subtotal}`
        items[10] = `Tax: ${tax}`
        items[11] = `Total: ${subtotal + tax}`
        items[6] = "No.of hashBrowns " + items[6];
        items[7] = "No.of Coffee cups " + items[7];
        items[8] = "No.of Bagels " + items[8];
        res.render("receipt", { items })
    }
})

app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
}) 