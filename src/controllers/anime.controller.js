const animeService = require("../services/anime");
const animeDb = require("../services/anime-db");
const rangeNumber = require("../utils/range-number");
const animeSorter = require("../utils/anime-sorter");
const animeMapper = require("../utils/anime-mapper");

const animeById = async ({ params, query }, response) => {
  const episode = Number(query.episode) || 1;
  const translation = query.translation;

  try {
    return await animeService.getAnimeById(params.id, episode, translation);
  } catch (error) {
    response.status(404);
    return { error };
  }
};

const animeList = ({ query }) => {
  const sortDirection = query["sort-direction"] || "desc";
  const selectedSort = animeSorter.select(query["sort-field"], sortDirection);
  const limit = rangeNumber(query["limit"], 1, 100);

  return animeDb
    .animeList()
    .sort(selectedSort)
    .slice(0, limit)
    .map(animeMapper.list);
};

const animeSearch = ({ query }) => {
  return animeDb.animeSearch(query["title"] || "").map(animeMapper.list);
};

module.exports = {
  animeList,
  animeById,
  animeSearch
};
