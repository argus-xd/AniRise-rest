const kodikClient = require("../clients/kodik");
const animeDb = require("../services/anime-db");
const get = require("lodash.get");

const rangeNumber = (limit, from, to) => {
  limit = Number(limit) || to;

  if (limit < from) return from;
  if (limit > to) return to;

  return limit;
};

const availableSorts = direction => ({
  date: (a, b) => {
    const aDate = new Date(a.updated_at);
    const bDate = new Date(b.updated_at);

    if (direction === "asc") {
      return aDate < bDate ? -1 : 1;
    }

    return aDate < bDate ? 1 : -1;
  },
  rating: (a, b) => {
    const aRating = get(a, "material_data.shikimori_rating", 0);
    const bRating = get(b, "material_data.shikimori_rating", 0);

    if (direction === "asc") {
      return aRating - bRating;
    }

    return bRating - aRating;
  }
});

const animeList = ({ query }) => {
  const sortDirection = query["sort-direction"] || "desc";
  const selectedSort = availableSorts(sortDirection)[query["sort-field"]];
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
