const { url, authToken } = require("../config").clients.kodik;
const axios = require("axios");

const getAnimeList = (limit = 100) => {
  return axios
    .get(url + "/list", {
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
