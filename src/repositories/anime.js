const mysql = require("mysql2");
const config = require("../config").mysql;

const pool = mysql
  .createPool({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db,
    connectionLimit: 5
  })
  .promise();

const getAll = async () => {
  return pool.execute("SELECT * FROM `anime`").then(([rows]) => rows);
};

module.exports = { getAll };
