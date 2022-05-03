// Import the data base connection boiler plate
const db = require('./connection');
// Connect the database and display a log of it
db.connect(console.log('Database connected in queryHandling.js'));

// Import package to illustrate the data through tables
const cTable = require('console.table');

module.exports = (sql, params, label) => {
  // This functions takes sql commands (and in some cases also includes the params) and then...
  // handles the queries to return the data accordingly
  if (params) {
    // If params exist, that means we're attempting to add data
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result); // Return the appropriate result
      //    process.exit(); // Terminate command line after returning data
    });
  } else {
    // If params does not exist, that means we're just viewing the data
    db.query(sql, (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      // Generate the table using the data we received
      const table = cTable.getTable(rows);
      // Display the table with it's associated label
      console.log(`\n\n------------ ${label.toUpperCase()} ------------\n`);
      console.log(table);
      process.exit();
    });
  }
};