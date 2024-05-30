-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

-- Create departments table
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create roles table with foreign key reference to departments table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Create employees table with foreign key references to roles and employees (for manager)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER ,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id)ON DELETE SET NULL
);

-- Initial data into departments table
INSERT INTO departments (name)
VALUES 
  ('Engineering'),
  ('Developers'),
  ('Finance');

--Initial data into roles table
INSERT INTO roles (title, salary, department_id)
VALUES 
  ('CEO', 200000.00, 1),
  ('Junior Developer', 60000.00, 2),
  ('Finacial Advisor', 100000.00, 3);

-- Insert initial data into employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
  ('John', 'Doe', 1, NULL),
  ('Rachel', 'Adams', 2, 1),
  ('Chris', 'Rock', 3, 1);
