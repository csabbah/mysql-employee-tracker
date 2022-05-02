// Import the required modules
const inquirer = require('inquirer');
const db = require('./db/connection');
db.connect(console.log('Database connected.'));

const promptOptions = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'options',
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
  console.log(selectedOption);
  if (selectedOption.options == 'View all departments') {
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
});
