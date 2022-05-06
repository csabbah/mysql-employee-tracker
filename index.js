// Import the function that handles the SQL commands
const handleQuery = require('./db/queryHandling');
// Import the data base connection boiler plate
const db = require('./db/connection');
// Connect the database and display a log of it
db.connect(console.log('Database connected in index.js'));
// Import all prompts (initial and follow up prompts)
const {
  promptOptions,
  promptDeleteEmployee,
  promptDeleteRole,
  promptDeleteDepartment,
  promptEmployeeDepart,
  promptEmployeeManager,
  promptUpdateRole,
  promptUpdateManager,
  promptAddDepartment,
  promptAddRole,
  promptAddEmployee,
  promptOrderData,
  promptViewBudget,
} = require('./utils/prompts');

// Execute the initial prompt and then extract the data accordingly
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
      // Add a label parameter so we can label the table before we display it
      // And add 'null' since we are not using the params parameter
      handleQuery(sql, null, 'Departments', data.orderData, data.descAsc);
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
            ? 'department.name'
            : ''
        } ${data.descAsc == 'Ascending order' ? '' : 'DESC'}`;
      handleQuery(sql, null, 'Roles', data.orderData, data.descAsc);
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
          ? 'department.name'
          : data.orderData == 'By salary'
          ? 'role.salary'
          : ''
      } ${data.descAsc == 'Ascending order' ? '' : 'DESC'} ;
      `;
      handleQuery(sql, null, 'Employees', data.orderData, data.descAsc);
    });
  }

  if (optionPicked == 'View employees by department') {
    promptEmployeeDepart();
  }

  if (optionPicked == 'View employees by manager') {
    promptEmployeeManager();
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
      console.log(`\nAdded ${data.departmentName} to the database!\n`);
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
        console.log(`\nAdded ${data.roleName} to the database!\n`);
        // Exit the command line from here
        process.exit();
      });
    });
  }

  if (optionPicked == 'Add an employee') {
    promptAddEmployee();
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
    promptUpdateManager();
  }

  // ------------------------------------------------------------ --- --- --- --- RETRIEVE DATA
  // ---- ---- ---- Returns a sum of an entire column of data
  if (optionPicked == 'View total utilized budget of a department') {
    promptViewBudget();
  }
});
