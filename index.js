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
        'View all departments',
        'View all roles',
        'View all employees',
        'View employees by manager',
        'View employees by department',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Delete department(s)',
        'Delete role(s)',
        'Delete an employee(s)',
        'Update an employee role',
        'Update an employees manager',
        'View total utilized budget of a department',
      ],
    },
  ]);
};

promptOptions().then((selectedOption) => {
  const { optionPicked } = selectedOption; // Extract the value from the object

  // Execute the conditionals to return the appropriate data
  if (optionPicked == 'View all departments') {
    const sql = `SELECT * FROM department`; // Select all data from the department table
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).console.log({ error: err.message });
        return;
      }
      console.log({
        message: 'success',
        data: rows,
      });
      process.exit(); // Terminate command line after returning data
    });
  }
  if (optionPicked == 'View all roles') {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).console.log({ error: err.message });
        return;
      }
      console.log({
        message: 'success',
        data: rows,
      });
      process.exit();
    });
  }
  if (optionPicked == 'View all employees') {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).console.log({ error: err.message });
        return;
      }
      console.log({
        message: 'success',
        data: rows,
      });
      process.exit();
    });
  }
});
