const animeDb = require("../services/anime-db");
const rangeNumber = require("../utils/range-number");
const animeSorter = require("../utils/anime-sorter");
const get = require("lodash.get");

const animeList = ({ query }) => {
  const sortDirection = query["sort-direction"] || "desc";
  const selectedSort = animeSorter.select(query["sort-field"], sortDirection);
  const limit = rangeNumber(query["limit"], 1, 100);

  return animeDb
    .animeList()
    .sort(selectedSort)
    .slice(0, limit)
    .map(listFormatMapper);
};

const animeSearch = ({ query }) => {
  return animeDb.animeSearch(query["title"] || "").map(listFormatMapper);
};

const listFormatMapper = anime => ({
  title: anime.title,
  shikimoriId: anime.shikimori_id,
  updated_at: anime.updated_at,
  rating: get(anime, "material_data.shikimori_rating", 0),
  poster: get(anime, "material_data.poster_url", "")
});

module.exports = {
  animeList,
  animeSearch
};
