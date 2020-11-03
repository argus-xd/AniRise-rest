const kodikClient = require("../clients/kodik");
const animeDb = require("../services/anime-db");

const animeList = () => {
  return kodikClient.getAnimeList();
};

const animeSearch = ({ params }) => {
  return animeDb.animeSearch(params["term"] || "");
};

module.exports = {
  animeList,
  animeSearch
};
