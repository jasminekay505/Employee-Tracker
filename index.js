//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');
const create = require('./lib/create');
const read = require('./lib/read');
const update = require('./lib/update');
const remove = require('./lib/delete');

//Connect to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'company_db',

});

connection.connect((err) => {
    if (err) throw err;
    //console.log(`connected as id ${connection.threadId}`);
    init();
    //connection.end();
});

const init = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'Add department, role or employee',
                'View deparment, role, or employee',
                'Update employee role',
                'Update employee manager',
                'View employees by manager',
                'Delete department, role or employee',
                'View budget summary by department',
                'Exit application'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'Add deparment, role or employee':
                    break;
                case 'View deparment, role or employee':
                    break;
                case 'Update employee role':
                    break;
                case 'Exit application':
                    connection.end();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    connection.end();
                    break;
            }
        });
};