"use strict";
const express = require('express'),
    path = require('path'),
    app = express();




app.set("port", 8001);
app.set("view engine", 'ejs')


app.get('/', (req, res) => {
    res.render('form');
})

app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
})