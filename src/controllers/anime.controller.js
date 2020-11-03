const kodikClient = require("../clients/kodik");

const animeList = () => {
  return kodikClient.getAnimeList();
};

module.exports = {
  animeList
};
