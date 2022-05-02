// Import the required modules
const inquirer = require('inquirer');
// Import the data base connection boiler plate
const db = require('./db/connection');
// Connect the database and display a log of it
db.connect(console.log('Database connected.'));

// The executes the initial prompt with the list of options
const promptOptions = () => {
  return inquirer.prompt([
    {
      // In the command line, provide the user with a list of options to choose from
      type: 'list',
      name: 'optionPicked', // 'optionPicked' would be the object that is declared & used below when extracting the users chosen option
      message: 'What would you like to do?', // The prompt question
      choices: [
        // The choices are the values that get pushed into the object 'optionPicked'
        'View all departments', // done
        'View all roles', // done
        'View all employees', // done
        'View employees by manager',
        'View employees by department',
        'Add a department', // done
        'Add a role', // done
        'Add an employee', // done
        'Delete a department', // done
        'Delete a role', // done
        'Delete an employee', // done
        'Update an employee role',
        'Update an employees manager',
        'View total utilized budget of a department',
      ],
    },
  ]);
};

// This functions takes sql commands (and in some cases also includes then params) and then...
// handles the queries to return the data accordingly
function handleQuery(sql, params) {
  if (params) {
    // If params exist, that means we're attempting to add data
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result); // Return the appropriate result
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
      process.exit();
    });
  }
}

// Execute the prompts and then extract the data...
promptOptions().then((selectedOption) => {
  // From here, destructure the object and pull just the string data
  const { optionPicked } = selectedOption;

  // Execute the conditionals to return the appropriate data
  // ------------------------------------------------------------ --- --- --- --- VIEW DATA
  // ---- ---- ---- View all rows from a table depending on the chosen prompt
  if (optionPicked == 'View all departments') {
    const sql = `SELECT * FROM department`;
    handleQuery(sql);
  }
  if (optionPicked == 'View all roles') {
    const sql = `SELECT * FROM role`;
    handleQuery(sql);
  }
  if (optionPicked == 'View all employees') {
    const sql = `SELECT * FROM employee`;
    handleQuery(sql);
  }
  // ------------------------------------------------------------ --- --- --- --- ADD DATA
  // ---- ---- ---- Add a row of data into a table depending on the chosen prompt
  if (optionPicked == 'Add a department') {
    const sql = `INSERT INTO department (name) 
              VALUES (?)`;
    const params = ['Law']; // Add a new 'Law' department
    handleQuery(sql, params);
  }
  if (optionPicked == 'Add a role') {
    const sql = `INSERT INTO role (title, salary, department_id) 
              VALUES (?,?,?)`;
    const params = ['Criminal Law', '140000', 3];
    handleQuery(sql, params);
  }
  if (optionPicked == 'Add an employee') {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?)`;
    const params = ['Carlos', 'Sabbah', 2, 1];
    handleQuery(sql, params);
  }
  // ------------------------------------------------------------ --- --- --- --- DELETE DATA
  // ---- ---- ---- Delete a row of data from a table depending on the chosen prompt
  if (optionPicked == 'Delete a department') {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [3]; // Delete the department with ID of 3
    handleQuery(sql, params);
  }
  if (optionPicked == 'Delete a role') {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [3];
    handleQuery(sql, params);
  }
  if (optionPicked == 'Delete an employee') {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [3];
    handleQuery(sql, params);
  }
});
