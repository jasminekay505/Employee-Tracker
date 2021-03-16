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

exports.updateRole = () => {
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
                (err,res) => { 
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee updated!\n`);
                });
        })
}
