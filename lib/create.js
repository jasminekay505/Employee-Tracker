//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

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
                    console.log(`${res.affectedRows} department added!\n`);
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
                    console.log(`${res.affectedRows} role added!\n`);
                });
        });
}

//Add new employee
const createEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is the first name of the employee?'
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is the last name of the employee?'
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'What is the role id of the employee?'
            }
        ])
        .then((answer) => {
            console.log('Adding new employee...\n');
            const query = connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role_id
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee added!\n`);
                });
        });
}
