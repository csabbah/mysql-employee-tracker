// All the follow up prompts

const db = require('../db/connection');
try {
  db.connect(console.log('Database connected in prompts.js\n\n'));
} catch (error) {
  console.log(error);
}
const inquirer = require('inquirer');
const handleQuery = require('../db/queryHandling');
const cTable = require('console.table');

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
const promptDeleteDepartment = () => {
  const sql = `SELECT * from department
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = [];
    result.forEach((department) => {
      const { name } = department;
      // Only push unique departments
      if (!choices.includes(name)) {
        choices.push(name);
      }
      choices.sort();
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Which Department would you like to delete?',
          choices: choices,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data from 'result'
        result.forEach((department) => {
          // Once it finds the chosen department, it extracts the ID and initiates the SQL delete command
          if (data.departmentName == department.name) {
            var sql = `DELETE FROM department WHERE id = ${department.id}.`;
            handleQuery(sql, null);
            console.log(
              `\nSuccessfully deleted ${department.name} and all associated roles!\n`
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

    var choices = [];
    result.forEach((role) => {
      console.log(role);
      if (!choices.includes(role.title)) {
        choices.push(role.title);
      }
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'roleName',
          message: 'Which Role would you like to delete?',
          choices: choices,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data 'results'
        result.forEach((role) => {
          // Once it finds the chosen role, it extracts the ID and initiated the SQL delete command
          if (data.roleName == role.title) {
            var sql = `DELETE FROM role WHERE id = ${role.id}.`;
            handleQuery(sql, null);
            console.log(`\nSuccessfully deleted the ${role.title} role!\n`);
          }
        });
        process.exit();
      });
  });
};

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
    var choices = [];
    result.forEach((employee) => {
      const { first_name, last_name } = employee;
      choices.push(`${first_name} ${last_name}`);
      choices.sort();
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Which Employee would you like to delete?',
          choices: choices,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the results data
        result.forEach((employee) => {
          const firstName = data.employeeName.split(' ')[0];
          const lastName = data.employeeName.split(' ')[1];

          // Once it finds the chosen role, it extracts the ID and initiated the SQL delete command
          if (
            firstName == employee.first_name &&
            lastName == employee.last_name
          ) {
            var sql = `DELETE FROM employee WHERE id = ${employee.id}.`;
            handleQuery(sql, null);
            console.log(`\nSuccessfully deleted ${firstName} ${lastName}\n`);
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

const promptAddEmployee = () => {
  const sql = `SELECT role.title, role.id, employee.manager_id, employee.role_id
      FROM role
      LEFT OUTER JOIN employee ON employee.role_id = role.id`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var availableRoles = [];
    var largestId = 0;
    result.forEach((data) => {
      if (!availableRoles.includes(data.title)) {
        availableRoles.push(data.title);
      }
      if (largestId < data.manager_id) {
        largestId = data.manager_id;
      }
    });

    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Provide the employees first name (Required)',
          validate: (firstName) => {
            if (firstName) {
              return true;
            } else {
              console.log('You need to enter an employee name!');
              return false;
            }
          },
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Provide the employees last name (Required)',
          validate: (LastName) => {
            if (LastName) {
              return true;
            } else {
              console.log('You need to enter an employee name!');
              return false;
            }
          },
        },
        {
          type: 'list',
          name: 'employeeRole',
          message:
            'Please choose the employees role (from the available positions) (Required)',
          choices: availableRoles,
        },
        {
          type: 'input',
          name: 'managerId',
          message: `Enter a manager id greater 0 and less than/equal to ${largestId}) OR enter "NULL" to assign as manager (Required)`,
          validate: (managerId) => {
            if (
              (managerId > 0 && managerId <= largestId) ||
              managerId == 'NULL'
            ) {
              return true;
            } else {
              if (managerId > 0 || managerId <= largestId) {
                console.log(
                  `You need to enter a valid manager ID above 0 and less than or equal to ${largestId})!`
                );
              } else {
                console.log(`You need to enter "NULL" in all caps`);
              }
              return false;
            }
          },
        },
      ])
      .then((data) => {
        const { firstName, lastName, employeeRole, managerId } = data;
        result.forEach((job) => {
          if (employeeRole == job.title) {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?,?,?,?)`;
            const params = [firstName, lastName, job.id, managerId];
            handleQuery(sql, params);
            console.log(`\nAdded ${firstName} ${lastName} to the database!\n`);
            process.exit(); // Terminate command line after returning data
          }
        });
      });
  });
};

// ------------------------------------------------------------ --- --- --- --- FOLLOW UP VIEW SPECIFIC DATA PROMPT
// The below prompt will extract what department and or managers the user wants to view all employees in
const promptEmployeeDepart = () => {
  const sql = `SELECT * from department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = [];
    result.forEach((department) => {
      const { name } = department;
      if (!choices.includes(name)) {
        choices.push(name);
      }
      choices.sort();
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Which Department would you like to view all employees?',
          choices: choices,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        result.forEach((department) => {
          // Once it finds the chosen department, it extracts the ID and initiated the SQL delete command
          if (data.departmentName == department.name) {
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
              `All employees from the ${data.name} department`
            );
          }
        });
      });
  });
};

const promptEmployeeManager = () => {
  const sql = `SELECT employee.first_name, employee.last_name, employee.manager_id, employee.id
  FROM employee
  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    var managers = [];
    result.forEach((manager) => {
      if (manager.manager_id == null) {
        managers.push(`${manager.first_name} ${manager.last_name}`);
      }
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'Choose the manager to see which employees they manage:',
          choices: managers,
        },
      ])
      .then((data) => {
        result.forEach((manager) => {
          const firstName = data.manager.split(' ')[0];
          const lastName = data.manager.split(' ')[1];

          if (
            manager.first_name == firstName &&
            manager.last_name == lastName
          ) {
            const sql = `SELECT A.first_name AS 'first_name', A.last_name, ifnull(B.first_name, 'Manager') as 'manager_name'
              FROM employee A left outer join employee B
              ON A.manager_id = B.id
              WHERE B.id = ${manager.id};
              `;
            db.query(sql, (err, rows) => {
              if (err) {
                console.log({ error: err.message });
                return;
              }
              const table = cTable.getTable(rows);
              if (rows.length < 1) {
                console.log(
                  `\n\n------------ No employees under this manager ------------\n`
                );
              } else {
                console.log(table);
              }
              process.exit();
            });
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
    var choices = { employees: [], jobs: [] };
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
      choices.jobs.sort();
    });

    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Which employee would you like to update? (Required)',
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
        result.forEach((employee) => {
          const firstName = data.employeeName.split(' ')[0];
          const lastName = data.employeeName.split(' ')[1];
          if (
            employee.first_name == firstName &&
            employee.last_name == lastName
          ) {
            // Extract the index of the chosen employee
            dataToUpdate.id = employee.id;
          }
          // Extract the role id and department id data that pertains to the chosen role
          if (data.roleToUpdate == employee.job_title) {
            // Run one time to avoid adding multiple times
            if (runOnce) {
              dataToUpdate.newRoleId = employee.role_id;
              dataToUpdate.newRoleTitle = data.roleToUpdate;
              dataToUpdate.newDepartId = employee.department_id;
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
          `\nSuccessfully switched ${data.employeeName} to the ${newRoleTitle} role!\n`
        );
        process.exit();
      });
  });
};

const promptUpdateManager = () => {
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
    var choices = { employees: [], managers: [] };
    result.forEach((employee) => {
      // ONLY push non manager employees
      if (employee.manager_id != null) {
        const { first_name, last_name } = employee;
        choices.employees.push(`${first_name} ${last_name}`);
      }
    });
    result.forEach((manager) => {
      // Only push managers
      if (manager.manager_id == null) {
        const { first_name, last_name } = manager;
        choices.managers.push(`${first_name} ${last_name}`);
      }
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
          name: 'newManager',
          message: 'Which enter a new manager to assign: (Required)',
          choices: choices.managers,
        },
      ])
      .then((data) => {
        var dataToUpdate = {
          employeeId: '',
          newManagerid: '',
          chosenManager: '',
          chosenEmployee: '',
        };
        result.forEach((activeData) => {
          const chosenEmployee = data.employeeName;
          dataToUpdate.chosenEmployee = data.employeeName;
          const firstName = chosenEmployee.split(' ')[0];
          const lastName = chosenEmployee.split(' ')[1];

          const newManager = data.newManager;
          dataToUpdate.chosenManager = data.newManager;
          const managerFirstName = newManager.split(' ')[0];
          const managerLastName = newManager.split(' ')[1];

          if (
            firstName == activeData.first_name &&
            lastName == activeData.last_name
          ) {
            dataToUpdate.employeeId = activeData.id;
          }

          if (
            managerFirstName == activeData.first_name &&
            managerLastName == activeData.last_name
          ) {
            dataToUpdate.newManagerid = activeData.id;
          }
        });

        const sql = `UPDATE employee
        SET manager_id = ${dataToUpdate.newManagerid}
        WHERE employee.id = ${dataToUpdate.employeeId}
        `;
        handleQuery(sql, null);
        console.log(
          `\nSuccessfully updated ${dataToUpdate.chosenEmployee} to be managed by ${dataToUpdate.chosenManager}!\n`
        );
        process.exit();
      });
  });
};
// ------------------------------------------------------------ --- --- --- --- FOLLOW UP VIEW FULL BUDGET PROMPTS
// The below prompt will extract which department the user would like to see the full budget from
const promptViewBudget = () => {
  const sql = `SELECT * from department`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }

    var choices = [];
    result.forEach((department) => {
      const { name } = department;
      if (!choices.includes(name)) {
        choices.push(name);
      }
    });
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message:
            'Which Department would you like to view total utilized budget?',
          choices: choices,
        },
      ])
      .then((data) => {
        // This block of code will take the choice that was picked and compare it with the full data
        // Once it finds the chosen department, it extracts the ID and initiated the SQL delete command
        const sql = `
            SELECT role.salary, department.name AS department_name
            FROM role
            LEFT OUTER JOIN department ON role.department_id = department.id`;

        db.query(sql, (err, result) => {
          if (err) {
            console.log(err);
          }
          var value = 0;
          result.forEach((item) => {
            if (item.department_name == data.departmentName) {
              var newVal = parseInt(item.salary);
              value += newVal;
            }
          });
          console.log(
            `\nTotal utilized budget in the ${data.departmentName} department: $${value}\n`
          );
          process.exit();
        });
      });
  });
};

module.exports = {
  promptDeleteDepartment,
  promptDeleteRole,
  promptDeleteEmployee,
  promptEmployeeDepart,
  promptEmployeeManager,
  promptUpdateRole,
  promptUpdateManager,
  promptAddDepartment,
  promptAddRole,
  promptAddEmployee,
  promptOrderData,
  promptOptions,
  promptViewBudget,
};
