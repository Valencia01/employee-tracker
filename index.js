const mysql = require ("mysql2");
const inquirer = require ("inquirer");
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
      
    },
    console.log(`Connected to the employeeTracker_db database.`)
  );

function init () {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do",
            name: "action",
            choices: [
                "View all Employees", 
                "Add Employee", 
                "Update Employee Role", 
                "View all Roles",
                "Add Role",
                "View all Departments",
                "Add Department"
            ]
        }
    ])
    .then((data) => {
        if(data.action === "View all Roles"){
            viewAllRoles();
        }
    })
}
async function viewAllRoles () {
    const roles = await db.promise().query("SELECT * FROM role LEFT JOIN department ON department.id = role.department_id");
    console.table(roles[0]);
}

init();