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
        'View all departments', // DONE
        'View all roles', // DONE
        'View all employees', // SEMI-DONE > NEED TO UPDATE SITUATION WITH MANAGERS
        'View employees by manager',
        'View employees by department',
        'Add a department', // DONE
        'Add a role', // DONE
        'Add an employee',
        'Delete a department', // DONE
        'Delete a role', // DONE
        'Delete an employee', // DONE
        'Update an employee role', // DONE
        'Update an employees manager',
        'View total utilized budget of a department', // DONE
      ],
    },
  ]);
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP SORT DATA PROMPTS
// The below prompt will extract how the user wants to order the data they are viewing
const promptOrderData = (data) => {
  // Depending on the parameter that is passed, execute specific prompts
  if (data == 'roles') {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'orderData',
        message: `How would you like to sort your ${data} data?`,
        choices: ['By ID', 'By job title', 'By salary', 'By department'],
      },
      {
        type: 'list',
        name: 'descAsc',
        message: `How would you like to sort by:`,
        choices: ['Ascending order', 'Descending order'],
      },
    ]);
  }
  if (data == 'employees') {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'orderData',
        message: `How would you like to sort your ${data} data?`,
        choices: [
          'By ID',
          'By First name',
          'By Last name',
          'By job title',
          'By department',
          'By salary',
        ],
      },
      {
        type: 'list',
        name: 'descAsc',
        message: `How would you like to sort by:`,
        choices: ['Ascending order', 'Descending order'],
      },
    ]);
  }
  if (data == 'departments') {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'orderData',
        message: `How would you like to sort your ${data} data?`,
        choices: ['By ID', 'Department Name'],
      },
      {
        type: 'list',
        name: 'descAsc',
        message: `How would you like to sort by:`,
        choices: ['Ascending order', 'Descending order'],
      },
    ]);
  }
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP ADD DATA PROMPTS
// The below prompts will extract what the user wants to add to the database
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

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP UPDATE DATA PROMPTS
// The below prompt will extract first which employee the user wants to update followed by which role to update the employee with
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

      if (job_title == null) {
      } else {
        if (!choices.jobs.includes(job_title)) {
          choices.jobs.push(job_title);
        }
      }

      choices.fullData.push({
        // Job title, department id and role id will all be updated.
        name: [first_name, last_name],
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
        var runOnce = true;
        var dataToUpdate = {
          id: '',
          newRoleId: '',
          newDepartId: '',
          newRoleTitle: '',
        };
        choices.fullData.forEach((employee) => {
          const firstName = data.employeeName.split(' ')[0];
          const secondName = data.employeeName.split(' ')[1];
          if (employee.name[0] == firstName && employee.name[1] == secondName) {
            // Extract the index of the chosen employee
            dataToUpdate.id = employee.id;
          }
          // Extract the role id and department id data that pertains to the chosen role
          if (data.roleToUpdate == employee.job_title) {
            // Run one time to avoid adding multiple times
            if (runOnce) {
              dataToUpdate.newRoleId = employee.roleId;
              dataToUpdate.newRoleTitle = data.roleToUpdate;
              dataToUpdate.newDepartId = employee.depart_id;
              runOnce = false;
            }
          }
        });
        const { id, newRoleId, newRoleTitle } = dataToUpdate;
        const sql = `UPDATE employee
        SET role_id = ${newRoleId}
        WHERE id = ${id}
        `;
        handleQuery(sql, null);
        console.log(
          `Successfully switched ${data.employeeName} to the ${newRoleTitle} role!`
        );
        process.exit();
      });
  });
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP DELETE DATA PROMPTS
// The below prompt will extract what row the user would like to delete
const promptDeleteEmployee = () => {
  const sql = `SELECT employee.*, role.title AS job_title, role.salary, department.name AS department_name, role.department_id
    FROM employee 
    LEFT OUTER JOIN role ON employee.role_id = role.id
    LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY employee.role_id;
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    // **** ADD CODE *** This entire block can be made as one function since it is used more than once
    // **** ADD CODE *** to delete the employee, you might not need to include other stuff like job_title, role_id and etc???)
    var choices = { employees: [], fullData: [] };
    result.forEach((employee) => {
      const { first_name, last_name, job_title, role_id, id, department_id } =
        employee;
      choices.employees.push(`${first_name} ${last_name}`);

      choices.fullData.push({
        name: [first_name, last_name],
        // The id below is the index to refer to when choosing which data to delete
        id: id,
      });
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Which Employee would you like to delete?',
          choices: choices.employees,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        choices.fullData.forEach((employee) => {
          const firstName = data.employeeName.split(' ')[0];
          const lastName = data.employeeName.split(' ')[1];
          // Once it finds the chosen role, it extracts the ID and initiated the SQL delete command
          if (firstName == employee.name[0] && lastName == employee.name[1]) {
            var sql = `DELETE FROM employee WHERE id = ${employee.id}.`;
            handleQuery(sql, null);
            console.log(
              `Successfully deleted ${employee.name[0]} ${employee.name[1]}`
            );
          }
        });
        process.exit();
      });
  });
};

const promptDeleteRole = () => {
  // *** ADD CODE *** When you create the universal function for the below query, add a variable in the function
  // FOr example i.e. sql = 'SELECT * from ${variable-name}` - Universal function should be called, 'returnListChoices(label)'
  const sql = `SELECT * from role`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    // **** ADD CODE *** This entire block can be made as one function since it is used more than once
    var choices = { roles: [], fullData: [] };
    result.forEach((role) => {
      const { title, id } = role;
      if (!choices.roles.includes(title)) {
        choices.roles.push(title);
      }

      choices.fullData.push({
        title: title,
        // The id below is the index to refer to when choosing which data to delete
        id: id,
      });
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'roleName',
          message: 'Which Role would you like to delete?',
          choices: choices.roles,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        choices.fullData.forEach((role) => {
          // Once it finds the chosen role, it extracts the ID and initiated the SQL delete command
          if (data.roleName == role.title) {
            var sql = `DELETE FROM role WHERE id = ${role.id}.`;
            handleQuery(sql, null);
            console.log(`Successfully deleted the ${role.title} role!`);
          }
        });
        process.exit();
      });
  });
};

const promptDeleteDepartment = () => {
  // *** ADD CODE *** When you create the universal function for the below query, add a variable in the function
  // FOr example i.e. sql = 'SELECT * from ${variable-name}` - Universal function should be called, 'returnListChoices(label)'
  const sql = `SELECT * from department
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    // **** ADD CODE *** This entire block can be made as one function since it is used more than once
    var choices = { departments: [], fullData: [] };
    result.forEach((department) => {
      const { id, name } = department;
      if (!choices.departments.includes(name)) {
        choices.departments.push(name);
      }

      choices.fullData.push({
        depart_name: name,
        // The id below is the index to refer to when choosing which data to delete
        id: id,
      });
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Which Department would you like to delete?',
          choices: choices.departments,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        choices.fullData.forEach((department) => {
          // Once it finds the chosen department, it extracts the ID and initiated the SQL delete command
          if (data.departmentName == department.depart_name) {
            var sql = `DELETE FROM department WHERE id = ${department.id}.`;
            handleQuery(sql, null);
            console.log(
              `Successfully deleted ${department.depart_name} and all associated roles!`
            );
          }
        });
        process.exit();
      });
  });
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP VIEW SPECIFIC DATA PROMPT
// The below prompt will extract what department the uer wants to view all employees in
const promptEmployeeDepart = () => {
  // *** ADD CODE *** When you create the universal function for the below query, add a variable in the function
  // FOr example i.e. sql = 'SELECT * from ${variable-name}` - Universal function should be called, 'returnListChoices(label)'
  const sql = `SELECT * from department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    // **** ADD CODE *** This entire block can be made as one function since it is used more than once
    var choices = { departments: [], fullData: [] };
    result.forEach((department) => {
      const { id, name } = department;
      if (!choices.departments.includes(name)) {
        choices.departments.push(name);
      }

      choices.fullData.push({
        depart_name: name,
        // The id below is the index to refer to when choosing which data to delete
        id: id,
      });
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Which Department would you like to view all employees?',
          choices: choices.departments,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        choices.fullData.forEach((department) => {
          // Once it finds the chosen department, it extracts the ID and initiated the SQL delete command
          if (data.departmentName == department.depart_name) {
            const sql = `
            SELECT employee.first_name, employee.last_name, role.title AS job_title, role.salary, department.name AS department
            FROM employee
            LEFT OUTER JOIN role ON employee.role_id = role.id
            LEFT OUTER JOIN department ON role.department_id = department.id
            WHERE department_id = ${department.id}
            ORDER BY department_id;`;
            handleQuery(
              sql,
              null,
              `All employees from the ${data.departmentName} department`
            );
          }
        });
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
    promptOrderData('departments').then((data) => {
      const sql = `SELECT * FROM department ORDER BY ${
        data.orderData == 'By ID' ? 'department.id' : 'department.name'
      } ${data.descAsc == 'Ascending order' ? '' : 'DESC'}`;
      console.log(sql);
      // Add a label parameter so we can label the table before we display it
      // And add 'null' since we are not using the params parameter
      handleQuery(sql, null, 'Departments');
    });
  }

  if (optionPicked == 'View all roles') {
    promptOrderData('roles').then((data) => {
      const sql = `SELECT role.*, department.name AS department_name
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id ORDER BY ${
          data.orderData == 'By ID'
            ? 'role.id'
            : data.orderData == 'By job title'
            ? 'role.title'
            : data.orderData == 'By salary'
            ? 'role.salary'
            : data.orderData == 'By department'
            ? 'role.department_id'
            : ''
        } ${data.descAsc == 'Ascending order' ? '' : 'DESC'}`;
      handleQuery(sql, null, 'Roles');
    });
  }

  if (optionPicked == 'View all employees') {
    promptOrderData('employees').then((data) => {
      const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary
      FROM employee
      LEFT OUTER JOIN role ON employee.role_id = role.id
      LEFT OUTER JOIN department ON role.department_id = department.id ORDER BY ${
        data.orderData == 'By ID'
          ? 'employee.id'
          : data.orderData == 'By First name'
          ? 'employee.first_name'
          : data.orderData == 'By Last name'
          ? 'employee.last_name'
          : data.orderData == 'By job title'
          ? 'employee.role_id'
          : data.orderData == 'By department'
          ? 'role.department_id'
          : data.orderData == 'By salary'
          ? 'role.salary'
          : ''
      } ${data.descAsc == 'Ascending order' ? '' : 'DESC'} ;
      `;
      handleQuery(sql, null, 'Employees');
    });
  }

  if (optionPicked == 'View employees by department') {
    promptEmployeeDepart();
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
      process.exit(); // Terminate command line after returning dat
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
    // process.exit(); // Terminate command line after returning data
  }
  // ------------------------------------------------------------ --- --- --- --- DELETE DATA
  // ---- ---- ---- Delete a row of data from a table depending on the chosen prompt
  if (optionPicked == 'Delete a department') {
    promptDeleteDepartment();
  }

  if (optionPicked == 'Delete a role') {
    promptDeleteRole();
  }

  if (optionPicked == 'Delete an employee') {
    promptDeleteEmployee();
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
