const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Finance@123',
  database: 'finance_tracker',
});

module.exports = pool.promise();