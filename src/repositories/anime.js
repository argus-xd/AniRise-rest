const connection = require("./connection");

const getAll = async () => {
  return connection.execute("SELECT * FROM `anime`").then(([rows]) => rows);
};

const insert = animeList => {
  if (!animeList.length) return;

  const queryFields = objectFields(animeList[0]);

  const sql = `INSERT INTO anime (${queryFields.fields}) VALUES ? ON DUPLICATE KEY UPDATE ${queryFields.updateFields}`;

  return connection.query(sql, [animeList.map(anime => Object.values(anime))]);
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
