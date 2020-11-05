const animeDb = require("../services/anime-db");
const rangeNumber = require("../utils/range-number");
const animeSorter = require("../utils/anime-sorter");
const animeMapper = require("../utils/anime-mapper");

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
  animeSearch
};
