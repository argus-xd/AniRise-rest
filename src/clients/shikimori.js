const config = require("../config").clients.shikimori;

const client = require("axios").create({
  baseURL: config.url
});

const simpleGetRequest = endpoint => {
  return client
    .get(endpoint)
    .then(({ data }) => data)
    .catch(() => []);
};

const animeById = id => {
  return simpleGetRequest(`/api/animes/${id}`);
};

const franchiseById = id => {
  return simpleGetRequest(`/api/animes/${id}/franchise`);
};

module.exports = { animeById, franchiseById };
