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
        'View Employee by Manager',
        'Update Employee Role',
        'View Employee By Department',
        'Delete Employee',
        'View All Roles',
        'Add Role',
        'Delete Role',
        'View All Departments',
        'Add Department',
        'Delete Department',
        'View Department Budget',
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
        case 'View Employee By Manager':
            viewEmployeesByManager();
         break;
        case 'Update Employee Role':
            updateEmployeeManager();
         break;
        case 'View Employee By Department':
            viewEmployeesByDepartment();
         break;
         case 'Delete Employee':
            deleteEmployee();
         break;
        case 'View All Roles':
            viewRoles();
        break;
        case 'Add Role':
            addRole();
        break;
        case 'Delete Role':
            deleteRole();
         break;
        case 'View All Departments':
            viewDepartments();
        break;
        case 'Add Department':
            addDepartment();
        break;
        case 'Delete Department':
            deleteDepartment();
        break;
        case'View Department Budget':
            viewDepartmentBudget();
        break

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



// VIEW EMPLOYEES BY MANAGER
function viewEmployeesByManager() {
    inquirer.prompt([
      {
          type: 'input',
        name: 'managerId',
        message: 'Enter the ID of the manager:'
      }
    ]).then((answers) => {
        const query = `
        SELECT employees.*, roles.title AS job_title, roles.salary, departments.name AS department_name
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        WHERE manager_id = $1;
      `;
      client.query(query, [answers.managerId], (err, res) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.table(res.rows);
          tracker();
        }
    });
    });
  }
  
  // UPDATE EMPLOYEE MANAGER
  function updateEmployeeManager() {
      inquirer.prompt([
          {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the ID of the employee you want to update:'
        },
        {
          type: 'input',
          name: 'newManagerId',
          message: 'Enter the new manager ID for the employee (leave blank if none):',
          default: null
        }
      ]).then((answers) => {
        client.query(
          'UPDATE employees SET manager_id = $1 WHERE id = $2',
          [answers.newManagerId, answers.employeeId],
          (err) => {
            if (err) {
              console.error('Query error', err.stack);
            } else {
              console.log('Employee manager updated!');
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

  // VIEW EMPLOYEES BY DEPARTMENT
  function viewEmployeesByDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the ID of the department:'
      }
    ]).then((answers) => {
        const query = `
        SELECT employees.*, roles.title AS job_title, roles.salary
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        WHERE roles.department_id = $1;
      `;
      client.query(query, [answers.departmentId], (err, res) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.table(res.rows);
          tracker();
        }
      });
    });
}
  
  

// DELETE EMPLOYEE
  function deleteEmployee() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to delete:'
      }
    ]).then((answers) => {
      client.query(
          'DELETE FROM employees WHERE id = $1',
        [answers.employeeId],
        (err) => {
            if (err) {
            console.error('Query error', err.stack);
        } else {
            console.log('Employee deleted!');
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

// DELETE ROLE
function deleteRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleId',
      message: 'Enter the ID of the role you want to delete:'
    }
  ]).then((answers) => {
    client.query(
        'DELETE FROM roles WHERE id = $1',
        [answers.roleId],
        (err) => {
            if (err) {
          console.error('Query error', err.stack);
        } else {
          console.log('Role deleted!');
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

// DELETE DEPARTMENT
function deleteDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the ID of the department you want to delete:'
    }
  ]).then((answers) => {
    client.query(
      'DELETE FROM departments WHERE id = $1',
      [answers.departmentId],
      (err) => {
        if (err) {
          console.error('Query error', err.stack);
        } else {
          console.log('Department deleted!');
          tracker();
        }
      }
    );
  });
}

// VIEW DEPARTMENT BUDGET
function viewDepartmentBudget() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the ID of the department:'
    }
  ]).then((answers) => {
    const query = `
      SELECT SUM(roles.salary) AS total_budget
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      WHERE roles.department_id = $1;
    `;
    client.query(query, [answers.departmentId], (err, res) => {
      if (err) {
        console.error('Query error', err.stack);
      } else {
        console.log(`Total Utilized Budget of Department ${answers.departmentId}: $${res.rows[0].total_budget}`);
        tracker();
      }
    });
  });
}
tracker();
