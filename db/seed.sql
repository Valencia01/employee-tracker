INSERT INTO department (department_name)
VALUES
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Sales");

-- SELECT * FROM department;

INSERT INTO role (department_id, role_title, role_salary)
VALUES
    (1, "Lead Engineer", 90000.00),
    (2, "Accountant", 70000.00),
    (3, "Lawyer", 100000.00),
    (4, "Salesperson", 50000.00),
    (2, "Account Manager", 85000.00);

-- SELECT * FROM role;

INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES
    (5, "John", "Doe", NULL),
    (3, "Mike", "Chan", 1),
    (2, "Tom", "Allen", 1),
    (4, "Sam", "Kash", 1),
    (1, "Ashley", "Rodriguez", 1);

-- SELECT * FROM employee;