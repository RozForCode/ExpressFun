"use strict";
const express = require('express'),
    validator = require('express-validator'),
    check = validator.check,
    validationResult = validator.validationResult,
    app = express();

// env set methods 
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



// validate and process form submission;
app.post('/submit', [
    check('name').notEmpty().withMessage("name is required"),
    check('email').isEmail().withMessage('Please enter a valid email.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errArr = errors.array();
        const items = [];
        for (let i = 0; i < errArr.length; i++) {
            items.push(errArr[i].msg)
        }
        res.render('receipt', { items })
    }
    const items = ["name", 345825205, "nav@gmail"]
    res.render("receipt", { items })
})



app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
}) 