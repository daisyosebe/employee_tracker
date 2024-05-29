
employee ids, first names, last names, job titles, departments, salaries, and manager

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager.last_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON department.id = role.department_id
JOIN employee AS manager ON employee.manager_id = manager.id 

view all departments,   department names and department ids
SELECT department.name, department_id
FROM department

 job title, role id, the department that role belongs to, and the salary for that role
add a role, 

SELECT roles

