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
                "Add Department",
                "Quit"
            ]
        }
    ])
    .then((data) => {
        if(data.action === "View all Employees"){
            viewAllEmployees();
        }
        if(data.action === "View all Roles"){
            viewAllRoles();
        }
        if(data.action === "View all Departments"){
            viewAllDepartments();
        }
        if(data.action === "Quit"){
            process.exit();
        }

    })
}

async function viewAllDepartments () {
    const departments = await db.promise().query(`SELECT * FROM department`);
    console.table(departments[0]);
}
async function viewAllEmployees () {
    const employees = await db.promise().query(`
    SELECT employee.id AS id, employee.first_name, employee.last_name, role.role_title AS title, department.department_name AS department, role.role_salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id`);
    console.table(employees[0]);
}
async function viewAllRoles () {
    const roles = await db.promise().query(`
    SELECT role.id AS id, role.role_title AS title, department.department_name AS department, role.role_salary AS salary 
    FROM role 
    LEFT JOIN department ON role.department_id = department.id`);
    console.table(roles[0]);
}

init();