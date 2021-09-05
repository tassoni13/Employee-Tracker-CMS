//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');

require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  port: process.env.PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employeeTracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
});

const startPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Please choose an option:",
      choices: [
        "View all employees",
        "Add employee",
        "Remove employee",
        "View all roles",
        "Add role",
        "Remove role",
        "View all departments",
        "Add depertment",
        "Remove department",
        "Update employee's manager",
        "View employees by manager",
        "Finish",
        new inquirer.Separator()
      ]
    }
  ]).then((answer) => {
      switch (answer.menu) {
        case "View all employees":
          getEmployees();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "View all roles":
          getRoles();
          break;
        case "Add role":
          addRole();
          break;
        case "Remove role":
          removeRole();
          break;
        case "View all departments":
          getDept();
          break;
        case "Add department":
          addDept();
          break;
        case "Remove department":
          removeDept();
          break;
        case "Update employee's manager":
          undateManager();
          break;
        case "View employees by manager":
          getByManager();
          break;
        default:

        connection.end();
      }
  })
};
