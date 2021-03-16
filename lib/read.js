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

const view = () => { 
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
                break;
            case 'Employees':
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

const viewDepartments = () => { 
    const query = 'SELECT * FROM department';
    console.log('Selection all departments...\n');
    connection.query(query, (err, res) => { 
        if (err) throw err;
        console.table(res);
    })
}
view();