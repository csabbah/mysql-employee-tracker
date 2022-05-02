DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT PRIMARY KEY, -- department id
  name VARCHAR(30) NOT NULL -- department name
);

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT PRIMARY KEY, -- role id
  title VARCHAR(30) NOT NULL, -- role title
  salary DECIMAL NOT NULL, -- role salary
  department_id INTEGER, -- references the department associated with role 
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT PRIMARY KEY, -- employee id
  first_name VARCHAR(30) NOT NULL, -- employee first name
  last_name VARCHAR(30) NOT NULL, -- employee last name
  role_id INTEGER, -- references emeployee role 
  manager_id INTEGER NULL, -- references the manager associated with employee 
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL
);