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

function checkResults(sql) {
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

promptOptions().then((selectedOption) => {
  const { optionPicked } = selectedOption; // Extract the value from the object

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
});
