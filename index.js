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
    multipleStatements: true,
});

//Connect to mysql and start app
connection.connect((err) => {
    if (err) throw err;
    console.log(`
--------------------------------------------------------------------------------
_______  __   __  _______  ___      _______  __   __  _______  _______ 
|       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |
|    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|
|   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___ 
|    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|
|   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___ 
|_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|
 _______  ______    _______  _______  ___   _  _______  ______          
|       ||    _ |  |   _   ||       ||   | | ||       ||    _ |         
|_     _||   | ||  |  |_|  ||       ||   |_| ||    ___||   | ||         
  |   |  |   |_||_ |       ||       ||      _||   |___ |   |_||_        
  |   |  |    __  ||       ||      _||     |_ |    ___||    __  |       
  |   |  |   |  | ||   _   ||     |_ |    _  ||   |___ |   |  | |       
  |___|  |___|  |_||__| |__||_______||___| |_||_______||___|  |_|

--------------------------------------------------------------------------------  
    `
    )
    init();
});

//Initialize app
init = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add department, role or employee',
                'View all departments, roles or employees',
                'Update employee role',
                'Update employee manager',
                'View employees by department',
                'View employees by manager',
                'Exit application'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'Add department, role or employee':
                    createInit();
                    break;
                case 'View all departments, roles or employees':
                    readInit();
                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                case 'View employees by department':
                    viewEmployeebyDept();
                    break;
                case 'View employees by manager':
                    viewEmployeebyMgr();
                    break;
                case 'Update employee manager':
                    updateMgr();
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
                    dept_name: answer.deptName
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
                    message: 'Select a department for the new role.'
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
    let query = `SELECT * from role`
    connection.query(query, (err, res) => {
        if (err) throw err;
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
                    type: 'list',
                    choices: res.map(choice => choice.title),
                    message: 'Select a role for the new employee.'
                }
            ])
            .then((answer) => {
                console.log('Adding new employee...\n');
                connection.query(`INSERT INTO employee (first_name,last_name,role_id)
                VALUES
                    ('${answer.first}', '${answer.last}', (SELECT id FROM role WHERE title = '${answer.role_id}'));`,
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee added!\n`);
                        init();
                    });
            });
    })
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
    let query = `SELECT CONCAT(first_name, " ", last_name) AS full_name from employee; SELECT * from role;`
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    choices: res[0].map(choice => choice.full_name),
                    message: 'Select an employee to update.'
                },
                {
                    name: 'newRole',
                    type: 'list',
                    choices: res[1].map(choice => choice.title),
                    message: 'Select a new role.'
                }
            ])
            .then((answer) => {
                console.log('Updating employee role...\n');
                connection.query(
                    `UPDATE employee
                SET role_id = (SELECT role.id FROM role WHERE title = '${answer.newRole}')
                WHERE id = (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = '${answer.employee_id}') AS temp)`,
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee updated!\n`);
                        init();
                    });
            });
    });
}

//View employees by department
const viewEmployeebyDept = () => {
    let query = `SELECT * from department;`
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'dept',
                    type: 'list',
                    choices: res.map(choice => choice.dept_name),
                    message: 'Select the department whose employees you wish to view.',
                }
            ])
            .then((answer) => {
                console.log(`Selecting all employees in ${answer.dept} department...\n`)
                let query = `SELECT employee.id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', title AS 'Role', salary AS 'Salary', dept_name AS 'Department'FROM employee JOIN role on role.id = employee.role_id JOIN department on department.id = role.department_id WHERE department.id = (SELECT id FROM department WHERE dept_name = '${answer.dept}');`
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
}

//View employees by manager
const viewEmployeebyMgr = () => {
    let query = `SELECT CONCAT(first_name, " ", last_name) AS full_name from employee WHERE role_id = '1';`
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'mgr',
                    type: 'list',
                    choices: res.map(choice => choice.full_name),
                    message: 'Select the manager whose employees you wish to view.',
                }
            ])
            .then((answer) => {
                console.log(`Selecting all employees who report to ${answer.mgr}...\n`)
                let query = `SELECT employee.id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name' FROM employee WHERE manager_id = (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = '${answer.mgr}');`
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
}

//Update employee's manager
const updateMgr = () => {
    let query = `SELECT CONCAT(first_name, " ", last_name) AS full_name from employee; SELECT CONCAT(first_name, " ", last_name) AS mgr FROM employee WHERE role_id = 1;`
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    choices: res[0].map(choice => choice.full_name),
                    message: 'Select an employee to update.'
                },
                {
                    name: 'newMgr',
                    type: 'list',
                    choices: res[1].map(choice => choice.mgr),
                    message: 'Select a new manager.'
                }
            ])
            .then((answer) => {
                console.log('Updating employee manager...\n');
                connection.query(
                    `UPDATE employee
                SET manager_id = (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = '${answer.newMgr}') AS temp)
                WHERE id = (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = '${answer.employee_id}') AS temp)`,
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee updated!\n`);
                        init();
                    });
            });
    });
}
