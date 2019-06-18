const mysql = require("mysql2");

const CONFIG = require("../config/config")["db"];

// create the connection to database
const db1 = mysql.createPool({
  host: CONFIG.db_host1,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
  charset: "UTF8_GENERAL_CI"
});

const db2 = mysql.createPool({
  host: CONFIG.db_host2,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
  charset: "UTF8_GENERAL_CI"
});

//connection.connect();

module.exports = { db1, db2 };
