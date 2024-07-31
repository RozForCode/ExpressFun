"use strict"

const port = 8000,
    fs = require('fs'),
    http = require('http'),
    calculation = require('./modules/nj_calc_logic.js'),
    validation = require('./modules/nj_validations.js');


const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};



http.createServer((req, res) => {
    res.setHeader("Content-type", "text/html");
    if (req.url.indexOf('getResult') >= 0) {
        let urlObj = new URL(`https://${req.headers.host}${req.url}`);
        let amount = urlObj.searchParams.get('amount');
        let currency1 = urlObj.searchParams.get('currency1');
        let currency2 = urlObj.searchParams.get('currency2');

        console.log(amount + " " + currency1);
    } else {
        fs.readFile("index.html", (error, data) => {
            if (error) {
                res.statusCode = 404;
                res.write(`<p>File not found</p>`)
                console.log(error);
            } else {
                res.statusCode = 200;
                res.write(data);
            }
            res.end();
        });
    }
    res.statusCode = 200;
}).listen(port, () => {
    console.log(`Server running at on port  http://localhost:${port}`);
}) 