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

// Determine what data the user wants to read
exports.readInit = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What dataset would you like to view?',
            choices: [
                'Departments',
                'Roles',
                'Employees',
                'Exit application'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'Departments':
                    viewDepartments();
                    break;
                case 'Roles':
                    viewRoles();
                    break;
                case 'Employees':
                    viewEmployee();
                    break;
                case 'Exit application':
                    connection.end();
                    break;
                default:
                    console.log(`New Invalid action: ${answer.action}`);
                    connection.end();
                    break;
            }
        });
};

//Show all departments
const viewDepartments = () => {
    const query = 'SELECT * FROM department';
    console.log('Selecting all departments...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

//Show all roles
const viewRoles = () => {
    const query = 'Select * FROM role';
    console.log('Selecting all roles...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

//Show all employees
const viewEmployee = () => {
    const query = 'Select * FROM employee';
    console.log('Selecting all employees...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}