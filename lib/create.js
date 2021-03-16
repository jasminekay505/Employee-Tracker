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
const createInit = () => {
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
                    createDepartment();
                    break;
                case 'Role':
                    createRole();
                    break;
                case 'Employee':
                    createEmployee();
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
    inquirer
        .prompt({
            name: 'deptName',
            type: 'input',
            message: 'What is the department name?'
        })
        .then((answer) => {
            console.log('Adding new department...\n');
            const query = connection.query('INSERT INTO department SET ?',
                {
                    name: answer.deptName
                },
                (err, res) => {
                    if (err) throw err;
                    console.table(`${res.affectedRows} department added!\n`);
                });
        });
}

//Add new role
const createRole = () => {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?'
            },
            {
                name: 'dept_id',
                type: 'input',
                message: 'What is the department id of the role?'
            }
        ])
        .then((answer) => {
            console.log('Adding new role...\n');
            const query = connection.query('INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.dept_id
                },
                (err, res) => {
                    if (err) throw err;
                    console.table(`${res.affectedRows} role added!\n`);
                });
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

createInit();