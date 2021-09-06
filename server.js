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

const getEmployees = () => {
  const query =
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role on role.id = employee.role_id
    LEFT JOIN department on department.id = role.depertment_id
    LEFT JOIN employee AS manager on manager.id = employee.manager_id`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
};

const getRoles = () => {
  const query = 
  `SELECT role.id, role.title AS role, department.name AS department, role.salary
   FROM role
   LEFT JOIN department on role.department_id = department.id`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  })
};

const getDept = () => {
  const query = 
  `SELECT id, name AS department FROM department`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Employee first name:",
      validate: (name) => {
        if (name) {
          return true
        } else {
          return "Please enter a name"
        }
      }
    },
    {
      type: "input",
      name: "lastName",
      message: "Employee last name:",
      validate: (name) => {
        if (name) {
          return true
        } else {
          return "Please enter a name"
        }
      }
    },
    {
      type: "list",
      name: "role",
      message: "Select employee role:",
      choices: () => {
        let roleArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT title, id FROM role`, (err, res) => {
            if (err) throw err;
            res.forEach((role) => {
              roleArr.push({name: role.title, value: role.id});
            });
            resolve(roleArr);
          });
        });
      }
    },
    {
      type: "list",
      name: "manager",
      message: "Select employee manager:",
      choices: () => {
        let managerArr = [{name: "None", value: null}];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employee`, (err, res) => {
            if (err) throw err;
            res.forEach((emp) => {
              managerArr.push({name: emp.name, value: emp.id});
            });
            resolve(managerArr);
          });
        });
      }
    },
  ]).then((ans) => {
      connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.role}, ${answers.manager});`,
        (err, res) => {
          if (err) throw err;
          startPrompt();
    });
  });
};

const addRole = () => {
  inquirer.prompt ([
    {
      type: "input",
      name: "title",
      message: "Enter role title:",
      validate: (name) => {
        if (name) {
          return true
        } else {
          return "Please enter a role title"
        }
      }
    },
    {
      type: "input",
      name: "salary",
      message: "Enter role salary:",
      validate: (salary) => {
        console.log(typeof(salary))
        if (typeof(parseFloat(salary)) == 'number') {
          return true
        } else {
          return "Please enter valid salary"
        }
      }
    },
    {
      type: "list",
      name: "department",
      message: "Select role department:",
      choices: () => {
        let deptArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT name, id FROM department`, (err, res) => {
            if (err) throw err;
            res.forEach((dept) => {
              deptArr.push({name: dept.name, value: dept.id});
            });
            resolve(deptArr);
          });
        });
      }
    }
  ]).then((ans) => {
    connection.query(`INSERT INTO role (title, salary, department_id)
      VALUES ('${ans.title}', '${ans.salary}', ${ans.department});`,
      (err, res) => {
        if (err) throw err;
        startPrompt();
      }
    );
  });
};

const addDept = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter department name:",
      validate: (name) => {
        if (name) {
          return true
        } else {
          return "Please enter department name"
        }
      }
    }
  ]).then((ans) => {
    connection.query(`INSERT INTO department (name)
    VALUES ('${ans.name}');`,
    (err, res) => {
      if (err) throw err;
      startPrompt();
    });
  });
};

const removeEmployee = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Select employee to be deleted:",
      choices: () => {
        let employeeArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employee`, (err, res) => {
            if (err) throw err;
            res.forEach((emp) => {
              employeeArr.push({name: emp.name, value: emp.id});
            });
            resolve(employeeArr);
          });
        });
      }
    }
  ]).then((ans) => {
      connection.query(`DELETE FROM employee WHERE id = ${ans.employee};`,
      (err, res) => {
        if (err) throw err;
        console.log("Employee deleted.")
        startPrompt();
      });
  });
};

const removeRole = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Select role to delete:",
      choices: () => {
        let roleArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT title, id FROM role`, (err, res) => {
            if (err) throw err;
            res.forEach((role) => {
              roleArr.push({name: role.title, value: role.id});
            });
            resolve(roleArr);
          });
        });
      }
    }
  ]).then((ans) => {
    connection.query(`DELETE FROM role WHERE id = ${ans.role};`,
      (err, res) => {
        if (err) throw err;
        console.log("Role deleted.")
        startPrompt();
      });
  });
};

const removeDept = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "Select a department to be deleted:",
      choices: () => {
        let deptArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT name, id FROM department`, (err, res) => {
            if (err) throw err;
            res.forEach((dept) => {
              deptArr.push({name: dept.name, value: dept.id});
            });
            resolve(deptArr);
          });
        });
      }
    }
  ]).then((ans) => {
      connection.query(`DELETE FROM department WHERE id = ${ans.department};`,
      (err, res) => {
        if (err) throw err;
        console.log("Department deleted.")
        startPrompt();
      });
  });
};

const updateManager = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Select employee to update:",
      choices: () => {
        let employeeArr = [];
        return new Promise ((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employee`, (err, res) => {
            if (err) throw err;
            res.forEach((emp) => {
              employeeArr.push({name: emp.name, value: emp.id});
            });
            resolve(employeeArr);
          });
        });
      }
    },
    {
      type: "list",
      name: "manager",
      message: "Select employee manager:",
      choices: () => {
        let managerArr = [{name: "None", value: null}];
        return new Promise ((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employee WHERE id NOT IN(${ans.employee})`, (err, res) => {
            if (err) throw err;
            res.forEach((manager) => {
              managerArr.push({name: manager.name, value: manager.id});
            });
            resolve(managerArr);
          });
        });
      }
    }
  ]).then((ans) => {
      connection.query(`UPDATE employee SET manager_id = ${ans.manager} WHERE id = ${ans.employee};`,
      (err, res) => {
        if (err) throw err;
        console.log("Employee record updated.");
        startPrompt();
      });
  });
};

const getByManager = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Select manager:",
      choices: () => {
        let employeeArr = [];
        return new Promise((resolve, reject) => {
          connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employee`, (err, res) => {
            if (err) throw err;
            res.forEach((emp) => {
              employeeArr.push({name: emp.name, value: emp.id});
            });
            resolve(employeeArr);
          });
        });
      }
    }
  ]).then((ans) => {
      const query = 
      `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS name, role.title, department.name AS department, role.salary
      FROM employee
      LEFT JOIN role on role.id = employee.role_id
      LEFT JOIN department on department.id = role.department_id
      WHERE manager_id = ${ans.manager}`;

    connection.query(query, (err, res) => {
      if (err) throw err;
      if (res.length == 0) {
        console.log("This employee is not a manager");
      } else {
        console.table(res);
      }
      startPrompt();
    });
  });
};