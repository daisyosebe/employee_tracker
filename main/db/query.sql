SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.last_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON department.id = role.department_id
JOIN employee AS manager ON employee.manager_id = manager.id 