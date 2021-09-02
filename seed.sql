DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
    id INT PRIMARY KEY
    name VARCHAR(30) NULL,
);

CREATE TABLE role(
    id INT PRIMARY KEY,
    title VARCHAR(30) NULL,
    salary DECIMAL (10,4) NULL,
    department_id INT NOT NULL,
);

CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;