"use strict"
const port = 8000,
    path = require('path'),
    bodyparser = require('body-parser'),
    express = require('express'),
    app = express(),
    calculations = require('./modules/NJ_calc_logic.js'),
    validations = require('./modules/NJ_validations.js');
express.json()
app.set("view engine", "ejs")

app.use('/public', express.static(path.join(__dirname, 'public')))


app.use(bodyparser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/', (req, res) => {
    console.log(req.body)
    let result = "";
    if (validations.notValid(req.body.amount, req.body.currency1, req.body.currency2)) {
        result = "The amount should be a positive integer and currencies should not match"
    } else {
        result = calculations.conversion(req.body.amount, req.body.currency1, req.body.currency2);
        let c2 = req.body.currency2;
        result += (" " + c2);
    }
    res.render('index', { result: result });
})

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
})  