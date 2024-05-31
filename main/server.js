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
        'Update Employee Manager',
        'Update Employee Role',
        'View Employee By Department',
        'Delete Employee',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
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
         case 'Update Employee Manager':
            updateEmployeeManager();
         break;
        case 'Update Employee Role':
            updateEmployeeRole();
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
        case 'View All Departments':
            viewDepartments();
        break;
        case 'Add Department':
            addDepartment();
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
  SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, roles.salary, departments.name AS department_name,
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
        const result = res.rows.map(row => ({
            "ID": row.id,
            "First Name": row.first_name,
            "Last Name": row.last_name,
            "Job Title": row.job_title,
            "Department": row.department_name,
            "Salary": row.salary,
            "Manager": row.manager_name
          }));
          console.table(result);
          tracker();
        }
      });
    }

// ADD EMPLOYEE
function addEmployee() {
  client.query('SELECT id, title FROM roles', (err, roleRes) => {
    if (err) {
      console.error('Query error', err.stack);
      return;
    }
    const roleChoices = roleRes.rows.map(role => ({
      name: role.title,
      value: role.id
    }));
    client.query('SELECT id, first_name, last_name FROM employees', (err, managerRes) => {
      if (err) {
        console.error('Query error', err.stack);
        return;
      }
      const managerChoices = managerRes.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }));
      managerChoices.unshift({ name: 'None', value: null });
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
          type: 'list',
          name: 'roleId',
          message: 'Select the role for the employee:',
          choices: roleChoices
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the manager for the employee:',
          choices: managerChoices
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
    });
  });
}
  
// UPDATE EMPLOYEE MANAGER
function updateEmployeeManager() {

  client.query('SELECT id, first_name, last_name FROM employees', (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
      return;
    }
    const employeeChoices = res.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices
      }
    ]).then((selectedEmployee) => {
      client.query('SELECT id, first_name, last_name FROM employees WHERE id != $1', [selectedEmployee.employeeId], (err, res) => {
        if (err) {
          console.error('Query error', err.stack);
          return;
        }

        const managerChoices = res.rows.map(emp => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id
        }));

        managerChoices.unshift({ name: 'None', value: null });

        inquirer.prompt([
          {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager:',
            choices: managerChoices
          }
        ]).then((answers) => {
          client.query(
            'UPDATE employees SET manager_id = $1 WHERE id = $2',
            [answers.managerId, selectedEmployee.employeeId],
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
      });
    });
  });
}

//Update Employee Role
  function updateEmployeeRole() {
    client.query('SELECT id, first_name, last_name FROM employees', (err, res) => {
      if (err) {
        console.error('Query error', err.stack);
        return;
      }
      const employeeChoices = res.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
      }));
  
      client.query('SELECT id, title FROM roles', (err, res) => {
        if (err) {
          console.error('Query error', err.stack);
          return;
        }
        const roleChoices = res.rows.map(role => ({
          name: role.title,
          value: role.id
        }));
        inquirer.prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices
          },
          {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role:',
            choices: roleChoices
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
      });
    });
  }
  
// VIEW EMPLOYEES BY DEPARTMENT
function viewEmployeesByDepartment() {
    const departmentQuery = 'SELECT id, name FROM departments';
  
    client.query(departmentQuery, (departmentErr, departmentRes) => {
      if (departmentErr) {
        console.error('Query error', departmentErr.stack);
      } else {
        const departments = departmentRes.rows.map(department => ({ name: department.name, value: department.id }));
  
        inquirer.prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department to view its employees:',
            choices: departments
          }
        ]).then((answers) => {
          const query = `
            SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, roles.salary, departments.name AS department_name
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.id
            LEFT JOIN departments ON roles.department_id = departments.id
            WHERE departments.id = $1;
          `;
          client.query(query, [answers.departmentId], (err, res) => {
            if (err) {
              console.error('Query error', err.stack);
            } else {
              if (res.rows.length === 0) {
                console.log('Department needs employees.');
              } else {
                const result = res.rows.map(row => ({
                  "ID": row.id,
                  "First Name": row.first_name,
                  "Last Name": row.last_name,
                  "Role": row.job_title,
                  "Salary": row.salary,
                }));
                console.table(result);
              }
              tracker();
            }
          });
        });
      }
    });
  }

// DELETE EMPLOYEE
function deleteEmployee() {
    const employeeQuery = 'SELECT id, first_name, last_name FROM employees';
  
    client.query(employeeQuery, (employeeErr, employeeRes) => {
      if (employeeErr) {
        console.error('Query error', employeeErr.stack);
      } else {
        const employees = employeeRes.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
  
        inquirer.prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to delete:',
            choices: employees
          }
        ]).then((answers) => {
          const deleteQuery = 'DELETE FROM employees WHERE id = $1';
  
          client.query(deleteQuery, [answers.employeeId], (deleteErr) => {
            if (deleteErr) {
              console.error('Query error', deleteErr.stack);
            } else {
              console.log('Employee deleted successfully!');
              tracker();
            }
          });
        });
      }
    });
}
   
// VIEW ROLES
function viewRoles() {
    const query = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department_name
    FROM roles
    JOIN departments ON roles.department_id = departments.id;
    `;
  client.query(query, (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
    } else {
        const result = res.rows.map(row => ({
            "ID": row.id,
            "Title": row.title,
            "Department": row.department_name,
            "Salary": row.salary
          }));
          console.table(result);
          tracker();
       }
   });
}

// ADD ROLE
function addRole() {
    const departmentQuery = 'SELECT id, name FROM departments';
  
    client.query(departmentQuery, (departmentErr, departmentRes) => {
      if (departmentErr) {
        console.error('Query error', departmentErr.stack);
      } else {
        const departments = departmentRes.rows.map(department => ({ name: department.name, value: department.id }));
  
        inquirer.prompt([
          {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the name of the new role:'
          },
          {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the new role:'
          },
          {
            type: 'list',
            name: 'roleDepartment',
            message: 'Select the department for the new role:',
            choices: departments
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
    });
}
  
// VIEW DEPARTMENTS
function viewDepartments() {
    const query = `
    SELECT id, name AS department_name
    FROM departments;
  `;
  client.query(query, (err, res) => {
    if (err) {
      console.error('Query error', err.stack);
    } else {
        const result = res.rows.map(row => ({
            "ID": row.id,
            "Department": row.department_name
          }));
          console.table(result);
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

// VIEW DEPARTMENT BUDGET
function viewDepartmentBudget() {
    client.query('SELECT * FROM departments', (err, res) => {
      if (err) {
        console.error('Query error', err.stack);
      } else {
        const departments = res.rows.map(department => ({ name: department.name, value: department.id }));
  
        inquirer.prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department to view its total utilized budget:',
            choices: departments
          }
        ]).then((answer) => {
          const query = `
            SELECT SUM(roles.salary) AS total_budget
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.id
            WHERE roles.department_id = $1;
          `;
          client.query(query, [answer.departmentId], (err, res) => {
            if (err) {
              console.error('Query error', err.stack);
            } else {
              console.log(`Total utilized budget for the selected department: $${res.rows[0].total_budget}`);
              tracker();
            }
          });
        });
      }
    });
  }
  
  tracker();