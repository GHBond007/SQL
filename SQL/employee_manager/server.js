const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  //user: 'root',
  user: 'root',
  password: 'Password1',
  database: 'company_db'
});

connection.connect((err) => {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function viewAllRoles() {
    connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function viewAllEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'What is the name of the department?'
        }
      ])
      .then((answers) => {
        connection.query('INSERT INTO department (name) VALUES (?)', [answers.departmentName], (err, results) => {
          if (err) throw err;
          console.log('Department added successfully!');
          mainMenu();
        });
      });
  }
  
  function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does this role belong to?',
            choices: departments.map((department) => ({ name: department.name, value: department.id }))
          }
        ])
        .then((answers) => {
          connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department], (err, results) => {
            if (err) throw err;
            console.log('Role added successfully!');
            mainMenu();
          });
        });
    });
  }
  
  

  function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function viewAllRoles() {
    connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function viewAllEmployees() {
    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'What is the name of the department?'
        }
      ])
      .then((answers) => {
        connection.query('INSERT INTO department (name) VALUES (?)', [answers.departmentName], (err, results) => {
          if (err) throw err;
          console.log('Department added successfully!');
          mainMenu();
        });
      });
  }
  
  function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
      if (err) throw err;
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does this role belong to?',
            choices: departments.map((department) => ({ name: department.name, value: department.id }))
          }
        ])
        .then((answers) => {
          connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department], (err, results) => {
            if (err) throw err;
            console.log('Role added successfully!');
            mainMenu();
          });
        });
    });
  }
  
  function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
  
      connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'firstName',
              message: "What is the employee's first name?"
            },
            {
              type: 'input',
              name: 'lastName',
              message: "What is the employee's last name?"
            },
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles.map((role) => ({ name: role.title, value: role.id }))
            },
            {
              type: 'list',
              name: 'manager',
              message: "Who is the employee's manager?",
              choices: [
                { name: 'None', value: null },
                ...employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
              ]
            }
          ])
          .then((answers) => {
            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.role, answers.manager], (err, results) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              mainMenu();
            });
          });
      });
    });
  }
  
  function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
  
      connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Which employee would you like to update?',
              choices: employees.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
            },
            {
              type: 'list',
              name: 'newRole',
              message: "What is the employee's new role?",
              choices: roles.map((role) => ({ name: role.title, value: role.id }))
            }
          ])
          .then((answers) => {
            connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.newRole, answers.employee], (err, results) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              mainMenu();
            });
          });
      });
    });
  }
  
