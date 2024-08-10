"use strict";
// cpanel conn
// const conn = mysql2.createPool({
//     user: 'johnavro_johnavro',
//     connectionLimit: 2,
//     database: 'johnavro_A4',
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

exports.renderIndex((res, req) => {
    conn.query(`select * from A4_ORDERS`, (err, result) => {
        if (err) console.log(err);
        else {
            console.log(result)
            res.render('allorders', { orders: result })
        }
    })
})