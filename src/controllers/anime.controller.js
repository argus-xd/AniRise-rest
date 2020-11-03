const kodikClient = require("../clients/kodik");
const animeDb = require("../services/anime-db");
const get = require("lodash.get");

const pageLimit = limit => {
  limit = limit || 100;

  if (limit < 1) return 1;
  if (limit > 100) return 100;

  return limit;
};

const availableSorts = direction => ({
  date: (a, b) => false,
  rating: (a, b) => {
    const aRating = get(a, "material_data.shikimori_rating", 0);
    const bRating = get(b, "material_data.shikimori_rating", 0);

    if (direction === "asc") {
      return aRating - bRating;
    } else {
      return bRating - aRating;
    }
  }
});

const animeList = ({ query }) => {
  const sortDirection = query["sort-direction"] || "desc";
  const selectedSort =
    availableSorts(sortDirection)[query["sort-field"]] ||
    availableSorts(sortDirection).date;
  const limit = pageLimit(query["limit"]);

  console.log(sortDirection, limit);

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
  rating: get(anime, "material_data.shikimori_rating", 0),
  poster: get(anime, "material_data.poster_url", "")
});

module.exports = {
  animeList,
  animeSearch
};
