// //Dependencies
// const mysql = require('mysql');
// const inquirer = require('inquirer');
// const table = require('console.table');
// const create = require('./lib/create');
// const read = require('./lib/read');
// const update = require('./lib/update');
// const remove = require('./lib/delete');

// //Connect to mysql
// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: 'password',
//     database: 'company_db',

// });

// const add = () => { 
//     inquirer
//     .prompt({
//         name: 'action',
//         type: 'rawlist',
//         message: 'What would you like to add?',
//         choices: [
//             'Department',
//             'Role',
//             'Employee',
//         ],
//     })
//     .then((answer) => {
//         switch (answer.action) {
//             case 'Department':
//                 break;
//             case 'Role':
//                 break;
//             case 'Employee':
//                 break;
//             case 'Exit application':
//                 connection.end();
//                 break;
//             default:
//                 console.log(`Invalid action: ${answer.action}`);
//                 connection.end();
//                 break;
//         }
//     });
// };

// const addDepartment = () => { 

// }