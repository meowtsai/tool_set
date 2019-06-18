const mysql = require("mysql2");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const CONFIG = require("../config/config")["db"];

// create the connection to database
const pool = mysql.createPool({
  host: CONFIG.db_host1,
  user: CONFIG.db_user,
  database: CONFIG.db_database,
  password: CONFIG.db_password,
  port: CONFIG.db_port,
  charset: "UTF8_GENERAL_CI"
});

//connection.connect();

module.exports = pool;
