const { url, authToken } = require("../config").clients.kodik;
const client = require("axios").create({
  baseURL: url
});

const getAnimeList = (limit = 100) => {
  return client
    .get("/list", {
      params: {
        token: authToken,
        types: "anime-serial,anime",
        with_episodes: "true",
        with_material_data: "true",
        limit
      }
    })
    .then(({ data }) => {
      return data.results || [];
    })
    .catch(() => []);
};

module.exports = {
  getAnimeList
};
