-- -- THIS COVERS THE VIEW ALL ROLES
-- SELECT role.*, department.name AS department_name
-- FROM role
-- LEFT JOIN department
-- ON role.department_id = department.id;

-- -- THIS COVERS THE VIEW ALL EMPLOYEES
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
       



