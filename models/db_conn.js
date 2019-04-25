const mysql = require("mysql2");
const CONFIG = require("../config/config")[process.env.NODE_ENV];

// create the connection to database
const pool = mysql.createPool({
  host: CONFIG.db_host1,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port
});

//connection.connect();

module.exports = pool;
