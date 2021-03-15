DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE employee ( 
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR (30),
last_name VARCHAR(30),
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role ( 
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL (5,2),
department_id INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);
