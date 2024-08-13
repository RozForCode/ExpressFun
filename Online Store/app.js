"use strict";
const express = require('express'),
    validator = require('express-validator'),
    path = require('path'),
    mysql2 = require('mysql2'),
    check = validator.check,
    allorders = require('./controller/allordersControll.js'),
    validationResult = validator.validationResult,
    app = express();

// database configuration
//cpanel
const conn = mysql2.createPool({
    user: 'johnavro_johnavro',
    connectionLimit: 2,
    database: 'johnavro_A4',
    insecureAuth: true,
    password: 'BingoBingo@312',
    host: '127.0.0.1'
}
)
//local pc
// const conn = mysql2.createPool({
//     connectionLimit: 5,
//     host: "localhost",
//     user: "root",
//     password: "bingo123",
//     insecureAuth: true,
//     database: "summerevent"
// });

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
app.get('/allorders', allorders.renderIndex);




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


// insert data into database
function checkTable() {
    const query = `SHOW TABLES LIKE 'A4_ORDERS'`;
    conn.query(query, (err, result) => {
        if (err) console.log(err);
        if (result.length == 0) {
            const createQuery = `
            CREATE TABLE A4_ORDERS (
            id int auto_increment primary key,
            name VARCHAR(20),
            address VARCHAR(40),
            city VARCHAR(20),
            province VARCHAR(20),
            phone VARCHAR(12),
            email VARCHAR(40),
            HashBrowns int,
            Bagels int,
            Coffee int,
            subtotal int,
            tax int,
            total int
            )
            `;
            conn.query(createQuery, (err, result) => {
                if (err) throw err;
                console.log(`table created successfully`)
            })
        }
    })

}

checkTable();
function getTaxRate(province) {
    const taxRates = {
        'Alberta': 0.14,
        'BritishColumbia': 0.2,
        'Manitoba': 0.10,
        'NewBrunswick': 0.15,
        'NewfoundlandandLabrador': 0.16,
        'NorthwestTerritories': 0.21,
        'NovaScotia': 0.11,
        'Nunavut': 0.08,
        'Ontario': 0.17,
        'PrinceEdwardIsland': 0.14,
        'Quebec': 0.20,
        'Saskatchewan': 0.11,
        'Yukon': 0.18
    };

    return taxRates[province] || 0.11;
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
        items[10] = `Tax: ${getTaxRate(items[3])}`
        items[11] = `Total: ${subtotal + tax}`
        checkTable();

        conn.query(`INSERT INTO A4_ORDERS(name, address, city, province, phone, email, HashBrowns, Bagels, Coffee,subtotal,tax,total) VALUES(?,?,?,?,?,?,?,?,?,?,?,?);`,
            [items[0], items[1], items[2], items[3], Number(items[4]), items[5], items[6], items[7], items[8], subtotal, tax, (subtotal + tax)],
            (err, result) => {
                if (err) console.log(err);
                else console.log(result);
            })

        items[6] = "No.of hashBrowns " + items[6];
        items[7] = "No.of Coffee cups " + items[7];
        items[8] = "No.of Bagels " + items[8];
        res.render("receipt", { items })
    }
})

app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
})  