const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 10000,  // 10 seconds timeout
  connectTimeout: 10000 
});

module.exports = pool.promise();
