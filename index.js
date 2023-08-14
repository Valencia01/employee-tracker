const mysql = require ("mysql2");
const inquirer = require ("inquirer");
require('dotenv').config();

let rolesArr = [];
let employeesArr = ['None'];
let departmentsArr = [];

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
        if(data.action === "Add Employee"){
            addEmployee();
        }
        if(data.action === "Update Employee Role"){
            updateEmployee();
        }
        if(data.action === "View all Roles"){
            viewAllRoles();
        }
        if(data.action === "Add Role"){
            addRole();
        }
        if(data.action === "View all Departments"){
            viewAllDepartments();
        }
        if(data.action === "Add Department"){
            addDepartment();
        }
        if(data.action === "Quit"){
            process.exit();
        }

    })
}

async function viewAllDepartments () {
    const departments = await db.promise().query(`SELECT * FROM department`);
    console.table(departments[0]);

    init();
}
async function viewAllEmployees () {
    const employees = await db.promise().query(`
    SELECT employee.id AS id, employee.first_name, employee.last_name, role.role_title AS title, department.department_name AS department, role.role_salary AS salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id`);
    console.table(employees[0]);



    init();
}
async function viewAllRoles () {
    const roles = await db.promise().query(`
    SELECT role.id AS id, role.role_title AS title, department.department_name AS department, role.role_salary AS salary 
    FROM role 
    LEFT JOIN department ON role.department_id = department.id`);
    console.table(roles[0]);
    init();
}

function addEmployee () {

    const roleList = `SELECT * FROM role`;
    const employeeList = `SELECT * FROM employee`;
    db.query(roleList, function (err, results) {
        db.query(employeeList, function (err, results2) {
          
            for(let i = 0; i < results.length; i++){
                var titleText = results[i].role_title;
                var titleId = results[i].id
                rolesArr.push({
                    name: titleText,
                    value: titleId
                })
            } 
            for(let j = 0; j < results2.length; j++){
                var empText = results2[j].first_name + " " + results2[j].last_name;
                var empId = results2[j].id;
                employeesArr.push({
                    name: empText,
                    value: empId
                });
            } 
        
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'fname',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'lname',
                    message: "What is the employee's last name?",
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role",
                    choices: rolesArr,
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "manager",
                    choices: employeesArr,
                }
            ])
            .then((data) => {
                if (data.manager === "None") {
                    var sql = `INSERT INTO employee (role_id, first_name, last_name, manager_id) VALUES (${data.role}, "${data.fname}", "${data.lname}", NULL)`;
                }
                else {
                    var sql = `INSERT INTO employee (role_id, first_name, last_name, manager_id) VALUES (${data.role}, "${data.fname}", "${data.lname}", ${data.manager})`;
                }
                
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(`Added ${data.fname} ${data.lname} to the database`);
                        init();
                    }
                });
            })
        });
    });
}

function addRole() {
    const departmentList = `SELECT * FROM department`;
    db.query(departmentList, function (err, results) {
        for(let i = 0; i < results.length; i++){
            var titleText = results[i].department_name;
            var titleId = results[i].id;
            departmentsArr.push({
                name: titleText,
                value: titleId
            });
        } 

        inquirer.prompt([
            {
                type: 'input',
                name: 'rname',
                message: "What is the name of the role?",
            },
            {
                type: 'input',
                name: 'rsalary',
                message: "What is the salary of the role?",
                validate(input) {
                    if (!isNaN(input)) {
                        return true;
                    }
                    throw Error('Please enter a number');
                },
            },
            {
                type: "list",
                message: "What department does the role belong to?",
                name: "department",
                choices: departmentsArr,
            },

        ])
        .then((data) => {
            var sql = `INSERT INTO role (department_id, role_title, role_salary) VALUES (1, "${data.rname}", ${data.rsalary}.00)`;
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(`Added ${data.rname} to the database`);
                        init();
                    }
                });

        })
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dname',
            message: "What is the name of the department?",
        },

    ])
    .then((data) => {
        var sql = `INSERT INTO department (department_name) VALUES ("${data.dname}")`;
            db.query(sql, function (err, result) {
                if (err) {
                    throw err;
                }
                else {
                    console.log(`Added ${data.dname} to the database`);
                    init();
                }
            });

    })
}

function updateEmployee() {
    const roleList = `SELECT * FROM role`;
    const employeeList = `SELECT * FROM employee`;
    db.query(roleList, function (err, results) {
        db.query(employeeList, function (err, results2) {
          
            for(let i = 0; i < results.length; i++){
                var titleText = results[i].role_title;
                var titleId = results[i].id
                rolesArr.push({
                    name: titleText,
                    value: titleId
                })
            } 
            for(let j = 0; j < results2.length; j++){
                var empText = results2[j].first_name + " " + results2[j].last_name;
                var empId = results2[j].id;
                employeesArr.push({
                    name: empText,
                    value: empId
                });
            } 
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?", 
                    choices: employeesArr,
                },
                {
                    type: 'list',
                    name: 'erole',
                    message: "Which role do you want to assign the selected employee?", 
                    choices: rolesArr,
                },

            ])
            .then((data) => {
                var sql = `UPDATE employee SET role_id = ${data.erole} WHERE id = ${data.employee}`;
                    db.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log(`Updated employee's role`);
                            init();
                        }
                    });

            })
        });
    });
}


init();