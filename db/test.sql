-- -- THIS COVERS THE VIEW ALL ROLES
-- Depending on the placement in the SELECT, those are the columns that show in order from left to rightt
-- SELECT role.*, department.name AS department_name
-- FROM role
-- LEFT JOIN department
-- ON role.department_id = department.id;

-- -- THIS COVERS THE VIEW ALL EMPLOYEES
-- Depending on the placement in the SELECT, those are the columns that show in order from left to rightt
-- -- Select all data from employee, title and salary from role and just the name value from department
-- SELECT employee.*, role.title AS job_title, role.salary, department.name AS department_name
-- -- Priotize the employee table
-- FROM employee 
-- -- Join the role data to employee table IF employee.role_id is equal to the associated role.id
-- LEFT OUTER JOIN role ON employee.role_id = role.id
-- -- Join the department data to role table IF role.id is equal to the associated department.id
-- -- LEFT OUTER JOIN department ON role.department_id = department.id;
-- -- Order by the employee.role_id
-- LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY employee.role_id;
-- -- Order by the department.name
-- -- LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY department.name;


-- To successfully create a role, we first create the department which is associated in the role
-- INSERT INTO department (name) VALUES ('FFinal');
-- -- From there, we refer to max ID (which is the latest department added above)
-- INSERT INTO role (title, salary, department_id ) VALUES ('Final', 32332, SELECT max(id) from department);
       


-- -- Depending on the placement in the SELECT, those are the columns that show in order from left to rightt
-- SELECT employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary, department.id AS department_id
-- FROM employee 
-- LEFT OUTER JOIN role ON employee.role_id = role.id
-- LEFT OUTER JOIN department ON role.department_id = department.id 


-- This returns related data from 3 tables and only returns data where the department id = a certain value
-- -- Depending on the placement in the SELECT, those are the columns that show in order from left to right
-- SELECT employee.first_name, employee.last_name, role.title AS job_title, role.salary, department.name AS department
-- FROM employee 
-- LEFT OUTER JOIN role ON employee.role_id = role.id
-- LEFT OUTER JOIN department ON role.department_id = department.id
-- WHERE department_id = 1
-- ORDER BY department_id



USE company

-- SELECT employee.first_name, employee.last_name, role.title AS job_title, role.salary, department.name AS department
--             FROM employee
--             LEFT OUTER JOIN role ON employee.role_id = role.id
--             LEFT OUTER JOIN department ON role.department_id = department.id
--             WHERE department_id = 6

SELECT role.salary, department.name AS department_name
FROM role
LEFT OUTER JOIN department ON role.department_id = department.id



-- source db/test.sql