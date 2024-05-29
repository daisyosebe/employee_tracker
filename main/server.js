const { Client } = require('pg');
const inquirer = require('inquirer');

const client = new Client({
  user: 'postgres',  
  host: 'localhost',
  database: 'department_db',
  password: 'daisy',
  port: 5432,  // Correct PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

function tracker() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Exit'
      ]
    }
  ]).then((answers) => {
    switch (answers.action) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      default:
        client.end();
        break;
    }
  });
}

// VIEW EMPLOYEES
function viewEmployees() {
  const query = `
    SELECT employees.*, roles.title AS job_title, roles.salary, departments.name AS department_name,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
  `;
  client.query(query, (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
    } else {
      console.table(res.rows);
      tracker();
    }
  });
}

// ADD EMPLOYEE
function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'input',
      name: 'roleId',
      message: 'Enter the role ID for the employee:'
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'Enter the manager ID for the employee (leave blank if none):',
      default: null
    }
  ]).then((answers) => {
    client.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [answers.firstName, answers.lastName, answers.roleId, answers.managerId],
      (err) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.log('Employee added!');
          tracker();
        }
      }
    );
  });
}

// UPDATE EMPLOYEE ROLE
function updateEmployeeRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: 'Enter the ID of the employee you want to update:'
    },
    {
      type: 'input',
      name: 'newRoleId',
      message: 'Enter the new role ID for the employee:'
    }
  ]).then((answers) => {
    client.query(
      'UPDATE employees SET role_id = $1 WHERE id = $2',
      [answers.newRoleId, answers.employeeId],
      (err) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.log('Employee role updated!');
          tracker();
        }
      }
    );
  });
}

// VIEW ROLES
function viewRoles() {
  const query = `
    SELECT roles.*, departments.name AS department_name
    FROM roles
    JOIN departments ON roles.department_id = departments.id;
  `;
  client.query(query, (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
    } else {
      console.table(res.rows);
      tracker();
    }
  });
}

// ADD ROLE
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleTitle',
      message: 'Enter the title of the new role:'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Enter the salary for the new role:'
    },
    {
      type: 'input',
      name: 'roleDepartment',
      message: 'Enter the department ID for the new role:'
    }
  ]).then((answers) => {
    client.query(
      'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
      [answers.roleTitle, answers.roleSalary, answers.roleDepartment],
      (err) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.log('Role added!');
          tracker();
        }
      }
    );
  });
}

// VIEW DEPARTMENTS
function viewDepartments() {
  const query = `
    SELECT * FROM departments;
  `;
  client.query(query, (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
    } else {
      console.table(res.rows);
      tracker();
    }
  });
}

// ADD DEPARTMENT
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:'
    }
  ]).then((answer) => {
    client.query('INSERT INTO departments (name) VALUES ($1)', [answer.departmentName], (err) => {
      if (err) {
        console.error('Query error', err.stack);
      } else {
        console.log('Department added!');
        tracker();
      }
    });
  });
}

tracker();
