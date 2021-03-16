//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

//Connect to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'company_db',

});

// Determine what data the user wants to add
exports.createInit = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to add?',
            choices: [
                'Department',
                'Role',
                'Employee',
                'Exit application'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'Department':
                    viewDepartments();
                    break;
                case 'Role':
                    viewRoles();
                    break;
                case 'Employee':
                    viewEmployee();
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

//Add new department
const createDepartment = () => {
    const query = 'SELECT * FROM department';
    console.log('Selecting all departments...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

//Add new role
const createRole = () => {
    const query = 'Select * FROM role';
    console.log('Selecting all roles...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

//Add new employee
const createEmployee = () => {
    const query = 'Select * FROM employee';
    console.log('Selecting all employees...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}