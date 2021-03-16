//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

//Connection information
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'company_db',

});

//Connect to mysql and start app
connection.connect((err) => {
    if (err) throw err;
    init();
});

//Initialize app
init = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'Add department, role or employee',
                'View all departments, roles, or employees',
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
                case 'Add department, role or employee':
                    createInit();
                    break;
                case 'View all departments, roles, or employees':
                    readInit();
                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                case 'Exit application':
                    connection.end();
                    break;
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    init();
                    break;
            }
        });
}

//Determine what user wants to create
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
                default:
                    console.log(`Invalid action: ${answer.action}\n`);
                    init();
                    break;
            }
        });
}

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
            connection.query('INSERT INTO department SET ?',
                {
                    name: answer.deptName
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} department added!\n`);
                    init();
                });
        });
}

//Add new role
const createRole = () => {
    let query = `SELECT * FROM department`
    connection.query(query, (err, res) => { 
        if (err) throw err;

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
                type: 'list',
                choices: res.map(choice => choice.dept_name),
                message: 'Which department does this role belong to?'
            }
        ])
        .then((answer) => {
            console.log('Adding new role...\n');
            connection.query(`INSERT INTO role (title,salary,department_id)
                VALUES
                    ('${answer.title}', '${answer.salary}', (SELECT id FROM department WHERE dept_name = '${answer.dept_id}'));`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} role added!\n`);
                    init();
                });
        });

    })
    
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
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role_id
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee added!\n`);
                    init();
                });
        });
}

//Determine what user wants to see
const readInit = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What dataset would you like to view?',
            choices: [
                'Departments',
                'Roles',
                'Employees',
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
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    init();
                    break;
            }
        });
};

//Show all departments
const viewDepartments = () => {
    let query = `SELECT department.id AS 'ID', dept_name AS 'Department' FROM department;`;
    console.log('Selecting all departments...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

//Show all roles
const viewRoles = () => {
    let query = `SELECT role.id AS 'ID',  title AS 'Role', salary AS 'Salary', dept_name AS 'Department' FROM role `;
    query += `JOIN department ON department.id = role.department_id;`;
    console.log('Selecting all roles...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

//Show all employees
const viewEmployee = () => {
    let query = `SELECT employee.id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', title AS 'Role', salary AS 'Salary', dept_name AS 'Department' FROM employee `;
    query += `JOIN role on role.id = employee.role_id `;
    query += `JOIN department ON department.id = role.department_id;`;
    console.log('Selecting all employees...\n');
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

// Update employee role based on input
const updateRole = () => {
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'Please enter the id of the employee whose role you would like to update.'
            },
            {
                name: 'newRole',
                type: 'input',
                message: 'Please enter the new role id.'
            }
        ])
        .then((answer) => {
            console.log('Updating employee role...\n');
            const query = connection.query(
                'UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: answer.newRole,
                    },
                    {
                        id: answer.employee_id,
                    }
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee updated!\n`);
                });
        })
}
// Determine what user wants to remove
const remove = () =>  {
    inquirer
    .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to remove?',
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
                deleteDepartment();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
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
}
//Remove department
const deleteDepartment = () => { 
    inquirer
    .prompt( { 
        name: 'department',
        type: 'input',
        massage: 'Please enter the id of the department you would like to remove.'
    })
    .then((answer) => { 
        console.log('Removing department...\n');
        const query = connection.query(
            'DELETE FROM department WHERE ?',
            {
                id: answer.department,
            },
            (err, res) => { 
                if (err) throw err;
                console.log(`${res.affectedRows} department removed!\n`);
            });
    });
}
