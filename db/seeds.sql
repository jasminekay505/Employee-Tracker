INSERT INTO department (dept_name)
VALUES
('Management'),
('Sales'),
('Administration'),
('Accounting'),
('Quality Control'),
('Supplier Relations'),
('Customer Relations'),
('Temporary'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
('Regional Manager', 65, 1),
('Salesman', 39, 2),
('Receptionist', 20, 3),
('Accountant', 35, 4),
('Quality Control Expert', 35, 5),
('Supplier Relations Expert', 32, 6),
('HR Representative', 30, 9),
('Customer Relations Expert', 30, 7),
('Temporary Employee', 10, 8);


INSERT INTO employee (first_name, last_name, role_id)
VALUES
('Michael', 'Scott', 1),
('Dwight', 'Schrute', 2),
('Jim', 'Halpert', 2),
('Pam', 'Beasley', 3),
('Stanley', 'Hudson', 2),
('Phyllis', 'Lapin', 2),
('Angela', 'Martin', 4),
('Oscar', 'Gutierrez', 4),
('Creed', 'Bratton', 5),
('Meredith', 'Palmer', 6),
('Andy', 'Bernard', 2),
('Toby', 'Flenderson', 7),
('Kelly', 'Kapoor', 8),
('Ryan', 'Howard', 9);


UPDATE employee SET manager_id = 1 WHERE id > 1;