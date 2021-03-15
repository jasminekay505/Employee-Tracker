//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

//Connect to mysql
const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'company_db',

});

connection.connect((err) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connection.end();
    });