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

  const queryFields = objectFields(animeList[0]);

  const sql = `INSERT INTO anime (${queryFields.fields}) VALUES ? ON DUPLICATE KEY UPDATE ${queryFields.updateFields}`;

  await pool.query(sql, [animeList.map(anime => Object.values(anime))]);
};

const objectFields = object => {
  const keys = Object.keys(object);

  const fields = keys.join(", ");
  const updateFields = keys
    .filter(key => key !== "id")
    .map(key => `${key}=VALUES(${key})`)
    .join(", ");

  return { fields, updateFields };
};

module.exports = { getAll, insert };
