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

-- SELECT role.salary, department.name AS department_name
-- FROM role
-- LEFT OUTER JOIN department ON role.department_id = department.id


-- SELECT employee.first_name, employee.last_name, employee.first_name AS manager_name
-- FROM employee 
-- WHERE employee.id = employee.manager_id;


-- UPDATE employee SET employee.manager_id = 4 WHERE employee.id = 2;
-- SELECT * from employee;







-- IMPORTANT NOTE BEFORE THE COMMAND
-- Employee's id = manager_id value (for example, if an employee has a manager_id of 1, that means the employee with an index of 1 is the manager)
-- If an employee has a NULL value, it means they are managers 
-- important, we need this line for this to work:
-- FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL


-- From 'SELECT' to 'ON', these lines return the employees manager
-- At 'WHERE', this returns all employees with the manager id ofo 2

-- Choose employee A's first_name and last_name, and then choose employee B's first_name (label the column as manager_name)
SELECT A.first_name AS 'first_name', A.last_name, ifnull(B.first_name, 'Manager') as 'manager_name' 
   -- Join the first employee with the 2nd employee on the right
   FROM employee A left outer join employee B 
   -- If the first employees manager_id == the second employees.id, that means that B employee is their manager
   ON A.manager_id = B.id
   WHERE B.id = 2; -- Choose all employees where the manager has the ID of 2

-- source db/test.sql