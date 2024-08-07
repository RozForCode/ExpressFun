"use strict";
const express = require('express'),
    validator = require('express-validator'),
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
app.post('/submit', (req, res) => {
    const items = ["name", 345825205, "nav@gmail"]
    res.render("receipt", { items })
})









app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
})