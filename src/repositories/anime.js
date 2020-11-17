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

const insert = async animeList => {
  if (!animeList.length) return;

  const sql = `REPLACE INTO anime (${keysList(animeList[0])}) VALUES ?`;

  await pool
    .query(sql, [animeList.map(anime => Object.values(anime))]);
};

const keysList = object => Object.keys(object).join(", ");

module.exports = { getAll, insert };
