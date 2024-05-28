INSERT INTO department (department.name)
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
       