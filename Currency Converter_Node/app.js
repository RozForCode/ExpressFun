"use strict";

const port = 8000,
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    calculation = require('./modules/nj_calc_logic.js'),
    validation = require('./modules/nj_validations.js');

// Define the path to the CSS file
const pathCss = path.join(__dirname, 'public', 'nj_app.css');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
};

http.createServer((req, res) => {
    // Set the base content type to HTML
    res.setHeader("Content-type", "text/html");

    if (req.url.indexOf('getResult') >= 0) {
        // Handling API requests
        let urlObj = new URL(`http://${req.headers.host}${req.url}`);
        let amount = urlObj.searchParams.get('amount');
        let currency1 = urlObj.searchParams.get('currency1');
        let currency2 = urlObj.searchParams.get('currency2');

        console.log(amount + " " + currency1 + " " + currency2);
        res.end(); // Always end the response

    } else if (req.url.endsWith('.css')) {
        // Serving the CSS file
        fs.readFile(pathCss, (error, data) => {
            if (error) {
                res.statusCode = 404;
                res.write('404: File Not Found');
                res.end();
            } else {
                res.setHeader('Content-type', mimeTypes['.css']);
                res.write(data);
                res.end();
            }
        });
    } else {
        // Serving the HTML file
        fs.readFile("index.html", (error, data) => {
            if (error) {
                res.statusCode = 404;
                res.write('<p>File not found</p>');
                console.log(error);
            } else {
                res.statusCode = 200;
                res.write(data);
            }
            res.end();
        });
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
