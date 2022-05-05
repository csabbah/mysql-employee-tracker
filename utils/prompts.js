// All the follow up prompts

const db = require('../db/connection');
db.connect(console.log('Database connected in index.js'));
const inquirer = require('inquirer');
const handleQuery = require('../db/queryHandling');

var queryData = (sql) => {};

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
        'View employees by department', // DONE
        'Add a department', // DONE
        'Add a role', // DONE
        'Add an employee',
        'Delete a department', // DONE
        'Delete a role', // DONE
        'Delete an employee', // DONE
        'Update an employee role', // DONE
        'Update an employees manager',
        'View total utilized budget of a department',
      ],
    },
  ]);
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP SORT DATA PROMPTS
// The below prompt will extract how the user wants to order the data they are viewing
const promptOrderData = (data) => {
  // Depending on the parameter that is passed, execute specific prompts
  return inquirer.prompt([
    {
      type: 'list',
      name: 'orderData',
      message: `How would you like to sort your ${data} data?`,
      choices:
        data == 'roles'
          ? ['By ID', 'By job title', 'By salary', 'By department']
          : data == 'employees'
          ? [
              'By ID',
              'By First name',
              'By Last name',
              'By job title',
              'By department',
              'By salary',
            ]
          : (data = 'departments' ? ['By ID', 'Department Name'] : ''),
    },
    {
      type: 'list',
      name: 'descAsc',
      message: `How would you like to sort by:`,
      choices: ['Ascending order', 'Descending order'],
    },
  ]);
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
    var choices = { employees: [], fullData: [] };
    result.forEach((employee) => {
      const { first_name, last_name, id } = employee;
      choices.employees.push(`${first_name} ${last_name}`);
      choices.employees.sort();
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
  const sql = `SELECT * from role`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = { roles: [], fullData: [] };
    result.forEach((role) => {
      const { title, id } = role;
      if (!choices.roles.includes(title)) {
        choices.roles.push(title);
      }
      choices.roles.sort();
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
  const sql = `SELECT * from department
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = { departments: [], fullData: [] };
    result.forEach((department) => {
      const { id, name } = department;
      if (!choices.departments.includes(name)) {
        choices.departments.push(name);
      }
      choices.departments.sort();
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

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP VIEW SPECIFIC DATA PROMPT
// The below prompt will extract what department the uer wants to view all employees in
const promptEmployeeDepart = () => {
  const sql = `SELECT * from department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = { departments: [], fullData: [] };
    result.forEach((department) => {
      const { id, name } = department;
      if (!choices.departments.includes(name)) {
        choices.departments.push(name);
      }
      choices.departments.sort();

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
      choices.employees.sort();

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

module.exports = {
  promptDeleteDepartment,
  promptDeleteRole,
  promptDeleteEmployee,
  promptEmployeeDepart,
  promptUpdateRole,
  promptAddDepartment,
  promptAddRole,
  promptOrderData,
  promptOptions,
};
