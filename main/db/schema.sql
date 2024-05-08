DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;

\c department_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title: VARCHAR(30) UNIQUE NOT NULL
    salary: DECIMAL NOT NULL
    review TEXT NOT NULL,
    department_id: INTEGER NOT NULL
    FOREIGN KEY (movie_id)
    REFERENCES movies(id)
    ON DELETE SET NULL
);


CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name: VARCHAR(30) NOT NULL 
   last_name: VARCHAR(30)
    role_id: INTEGER NOT NULL
    manager_id: INTEGER
    ON DELETE SET NULL
);
