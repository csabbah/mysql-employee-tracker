// Import the data base connection boiler plate
const db = require('./connection');
// Connect the database and display a log of it
db.connect(console.log('\nDatabase connected in queryHandling.js'));

// Import package to illustrate the data through tables
const cTable = require('console.table');

module.exports = (sql, params, label, orderData, descAsc) => {
  // If the sql command contains 'DELETE FROM', execute this block of code
  if (sql.includes('DELETE FROM') || sql.includes('UPDATE')) {
    db.query(sql, function (err, result) {
      if (err) throw err;
    });
  }

  if (params) {
    // This functions takes sql commands (and in some cases also includes the params) and then...
    // handles the queries to return the data accordingly
    // If params exist, that means we're attempting to add data
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result); // Return the appropriate result
    });
  } else {
    // If params does not exist, that means we're just viewing the data
    db.query(sql, (orderData, descAsc), (err, rows) => {
      if (err) {
        console.log({ error: err.message });
        return;
      }
      // Generate the table using the data we received
      const table = cTable.getTable(rows);
      // If data does not exist, inform the user
      if (rows.length == 0) {
        console.log(`\n\n------------ No data exists ------------\n`);
      } else {
        // Else display the table with it's associated label
        console.log(`\n\n------------ ${label.toUpperCase()} ------------\n`);
        if (
          orderData == null ||
          (orderData == undefined && descAsc == null) ||
          descAsc == undefined
        ) {
        } else {
          console.log(`Sorted ${orderData} in ${descAsc}\n`);
        }
        console.log(table);
      }
      process.exit();
    });
  }
};
