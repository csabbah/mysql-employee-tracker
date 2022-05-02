// Import the required modules
const inquirer = require('inquirer');
const db = require('./db/connection');
db.connect(console.log('Database connected.'));

const promptOptions = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'optionPicked',
      message: 'What would you like to do?',
      choices: [
        'View all departments', // done
        'View all roles', // done
        'View all employees', // done
        'View employees by manager',
        'View employees by department',
        'Add a department', // done
        'Add a role', // done
        'Add an employee', // done
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'Update an employee role',
        'Update an employees manager',
        'View total utilized budget of a department',
      ],
    },
  ]);
};

function checkResults(sql, params) {
  if (params) {
    // If params exist, that means we're attempting to add data
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      process.exit(); // Terminate command line after returning data
    });
  } else {
    // If params does not exist, that means we're just viewing the data
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      console.log({
        message: 'success',
        data: rows,
      });
      process.exit(); // Terminate command line after returning data
    });
  }
}

promptOptions().then((selectedOption) => {
  const { optionPicked } = selectedOption; // Extract the value from the object

  // -------------------------------------------------- VIEW DATA
  // Execute the conditionals to return the appropriate data
  if (optionPicked == 'View all departments') {
    const sql = `SELECT * FROM department`; // Select all data from the department table
    checkResults(sql);
  }
  if (optionPicked == 'View all roles') {
    const sql = `SELECT * FROM role`;
    checkResults(sql);
  }
  if (optionPicked == 'View all employees') {
    const sql = `SELECT * FROM employee`;
    checkResults(sql);
  }
  // -------------------------------------------------- ADD DATA
  if (optionPicked == 'Add a department') {
    // Create a candidate
    const sql = `INSERT INTO department (name) 
              VALUES (?)`;
    const params = ['Law'];
    checkResults(sql, params);
  }
  if (optionPicked == 'Add a role') {
    // Create a candidate
    const sql = `INSERT INTO role (title, salary, department_id) 
              VALUES (?,?,?)`;
    const params = ['Criminal Law', '140000', 3];
    checkResults(sql, params);
  }
  if (optionPicked == 'Add an employee') {
    // Create a candidate
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?)`;
    const params = ['Carlos', 'Sabbah', 2, 1];
    checkResults(sql, params);
  }
  // -------------------------------------------------- DELETE DATA
  if (optionPicked == 'Delete a department') {
    const sql = `DELETE FROM department WHERE id = ?`; // Delete a row from department
    const params = [3]; // Delete the department with ID of 3

    checkResults(sql, params);
  }
  if (optionPicked == 'Delete a role') {
    const sql = `DELETE FROM role WHERE id = ?`; // Delete a row from role
    const params = [3]; // Delete the role with ID of 3

    checkResults(sql, params);
  }
  if (optionPicked == 'Delete an employee') {
    const sql = `DELETE FROM employee WHERE id = ?`; // Delete a row from employee
    const params = [3]; // Delete the employee with ID of 3

    checkResults(sql, params);
  }
});
