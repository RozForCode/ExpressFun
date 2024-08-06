"use strict";
const express = require('express'),
    path = require('path'),
    port = 8001,
    app = express();

app.get('/', (req, res) => {
    res.render('form');
})

app.listen(app.get("port"), () => {
    console.log(`App running on http://localhost:${app.get('port')}`)
})