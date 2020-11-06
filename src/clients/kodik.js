const { url, authToken } = require("../config").clients.kodik;
const client = require("axios").create({
  baseURL: url
});

const simpleGetRequest = (endpoint, params = {}) => {
  return client
    .get(endpoint, { params })
    .then(({ data }) => data.results)
    .catch(() => []);
};

const getAnimeList = (limit = 100) => {
  return simpleGetRequest("/list", {
    token: authToken,
    types: "anime-serial,anime",
    with_episodes: "true",
    with_material_data: "true",
    limit
  });
};

const getAnimeByShikimoriId = id => {
  return simpleGetRequest("/search", {
    token: authToken,
    shikimori_id: id
  });
};

module.exports = {
  getAnimeList,
  getAnimeByShikimoriId
};
