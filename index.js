// Import the required modules
const inquirer = require('inquirer');
// Import the function that handles the SQL commands
const handleQuery = require('./db/queryHandling');
// Import the data base connection boiler plate
const db = require('./db/connection');
// Connect the database and display a log of it
db.connect(console.log('Database connected in index.js'));

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
        'Add a department', // semi-done -- add validator to execute if user tries to add existing data
        'Add a role', // semi-done -- add validator to execute if user tries to add existing data
        'Add an employee',
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

// This executes the prompts to add a new department
const promptAddDepartment = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Provide the new department name (Required)',
      validate: (departmentName) => {
        if (departmentName) {
          return true;
        } else {
          console.log('You need to enter a department name!');
          return false;
        }
      },
    },
  ]);
};

const promptAddRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: 'Provide the new role name (Required)',
      validate: (roleName) => {
        if (roleName) {
          return true;
        } else {
          console.log('You need to enter a role name!');
          return false;
        }
      },
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Provide the salary for this role (Required)',
      validate: (salary) => {
        if (salary) {
          return true;
        } else {
          console.log('You need to enter a salary!');
          return false;
        }
      },
    },
    {
      type: 'input',
      name: 'departmentName',
      message: 'Provide the department name for this role: (Required)',
      validate: (departmentName) => {
        if (departmentName) {
          return true;
        } else {
          console.log('You need to enter a department name!');
          return false;
        }
      },
    },
  ]);
};

// Execute the prompts and then extract the data...
promptOptions().then((selectedOption) => {
  // From here, destructure the object and pull just the string data
  const { optionPicked } = selectedOption;

  // Execute the conditionals to return the appropriate data
  // ------------------------------------------------------------ --- --- --- --- VIEW DATA
  // ---- ---- ---- View all rows from a table depending on the chosen prompt
  if (optionPicked == 'View all departments') {
    const sql = `SELECT * FROM department`;
    // Add a label parameter so we can label the table before we display it
    // And add 'null' since we are not using the params parameter
    handleQuery(sql, null, 'Departments');
  }

  if (optionPicked == 'View all roles') {
    const sql = `SELECT role.*, department.name AS department_name
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id;
    `;

    handleQuery(sql, null, 'Roles');
  }

  if (optionPicked == 'View all employees') {
    const sql = `SELECT employee.*, role.title AS job_title, role.salary, department.name AS department_name
    FROM employee 
    LEFT OUTER JOIN role ON employee.role_id = role.id
    LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY employee.role_id;
    `;
    // const sql = `SELECT * FROM employee, role.id; FROM employee; LEFT JOIN role ON employee.role_id = role.id;`;
    handleQuery(sql, null, 'Employees');
  }
  // ------------------------------------------------------------ --- --- --- --- ADD DATA
  // ---- ---- ---- Add a row of data into a table depending on the chosen prompt
  if (optionPicked == 'Add a department') {
    promptAddDepartment().then((data) => {
      // Run the promptDepartment prompt and extract the new department name then....
      // Execute the INSERT sql command
      const sql = `INSERT INTO department (name) 
                VALUES (?)`;
      const params = [data.departmentName]; // And add this newly extracted department as the param
      handleQuery(sql, params);
    });
  }

  if (optionPicked == 'Add a role') {
    promptAddRole().then((data) => {
      // This block adds the new department FIRST so we can generate the required foreign key for the role
      const departmentSql = `INSERT INTO department (name)
      VALUES (?)`;
      const departmentParams = [data.departmentName]; // 'data' holds the submitted data via the command line prompts
      handleQuery(departmentSql, departmentParams);

      // This block adds the role
      // It first extracts the latest ID from the newly created department above
      const latestId = `SELECT max(id) from department`;
      db.query(latestId, (err, result) => {
        if (err) {
          console.log(err);
        }
        // This would return the id
        var latestId = result[0]['max(id)'];
        // This create the role using the latest id we extracted from the new department above
        const salary = parseInt(data.salary);
        const sql = `INSERT INTO role (title, salary, department_id)
          VALUES (?,?,?)`;
        // Again, data is the object that contains the submitted data via command line prompts
        const params = [data.roleName, salary, latestId];
        handleQuery(sql, params);
        // Exit the command line from here
        process.exit();
      });
    });
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
