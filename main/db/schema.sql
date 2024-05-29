DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;

\c department_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, 
   last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    manager_id INTEGER REFERENCES employee(id) ON DELETE SET NULL
    
);

INSERT INTO department (name)
VALUES ('Business'),
       ('HR'),
       ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES ('manager', 200000, 1 ),
       ('assistant', 30000, 2 ),
       ('CEO', 500000, 3);
       

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('john', 'Doe',1),
       ('Rachel', 'Adams',2),
       ('Chris', 'Rock',3);

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.last_name AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON department.id = role.department_id
JOIN employee AS manager ON employee.manager_id = manager.id 



