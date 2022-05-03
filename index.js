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
        // The choices are the values that get pushed into the array 'optionPicked'
        'View all departments',
        'View all roles',
        'View all employees',
        'View employees by manager',
        'View employees by department',
        'Add a department',
        'Add a role',
        'Add an employee',
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

const promptUpdateRole = () => {
  const sql = `SELECT employee.*, role.title AS job_title, role.salary, department.name AS department_name, role.department_id
    FROM employee 
    LEFT OUTER JOIN role ON employee.role_id = role.id
    LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY employee.role_id;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    // Generate the choices to be used in the list prompts below
    // Additionally add a fullData object to test the inputted data with
    var choices = { employees: [], jobs: [], fullData: [] };
    result.forEach((employee) => {
      const { first_name, last_name, job_title, role_id, id, department_id } =
        employee;
      choices.employees.push(`${first_name} ${last_name}`);
      if (!choices.jobs.includes(job_title)) {
        choices.jobs.push(job_title);
      }
      choices.fullData.push({
        // Job title, department id and role id will all be updated.
        job_title: job_title,
        roleId: role_id,
        depart_id: department_id,
        // The id below is the index to refer to when choosing which data to update
        id: id,
      });
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Which employee would you like to do update? (Required)',
          choices: choices.employees,
        },
        {
          type: 'list',
          name: 'roleToUpdate',
          message: `Which role do you want to switch employee to? (Required)`,
          choices: choices.jobs,
        },
      ])
      .then((data) => {
        // Take the data we received which is the name of the person to update and the job to switch to
        console.log('Submitted data', data);
        // Using the name of the person, find the ID. Using the chosen job title, find it's related department_id & role_id
        // From there, insert into the column using extracted ID the new job_title, role_id and department_id
        console.log('Full arr', choices.fullData);
        process.exit();
      });
  });
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
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary
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
      console.log(`Added ${data.departmentName} to the database!`);
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
        console.log(`Added ${data.roleName} to the database!`);

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
    console.log(`Added Carlos to the database!`);
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

  // ------------------------------------------------------------ --- --- --- --- UPDATE DATA
  // ---- ---- ---- Update a specific piece of data in a row depending on the chosen prompt
  if (optionPicked == 'Update an employee role') {
    // Since we are looking to include the name of the employees in the list input...
    // in the promptUpdateRole function, we run a db query at the same time we prompt the questions
    // so we can extract the names and add them to an array
    promptUpdateRole();
  }

  if (optionPicked == 'Update an employees manager') {
  }

  // ------------------------------------------------------------ --- --- --- --- RETRIEVE DATA
  // ---- ---- ---- Returns a sum of an entire column of data
  if (optionPicked == 'View total utilized budget of a department') {
  }
});
