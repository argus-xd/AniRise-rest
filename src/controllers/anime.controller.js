const kodikApi = require("../clients/kodik");
const animeDb = require("../services/anime-db");
const rangeNumber = require("../utils/range-number");
const animeSorter = require("../utils/anime-sorter");
const animeMapper = require("../utils/anime-mapper");

const animeById = async ({ params, query }, response) => {
  const translation = query.translation;
  const episode = Number(query.episode) || 1;

  const translations = await kodikApi.translationsListByShikimoriId(params.id);

  if (!translations.length) {
    response.status(404);
    return { error: "No anime found" };
  }

  const selectedTranslation =
    translations.find(tr => tr.id === translation) || translations[0].id;
  const animeInfo = await kodikApi.getAnimeByTranslatorId(selectedTranslation);

  if (!animeInfo) {
    response.status(404);
    return { error: "No anime found" };
  }

  return {
    ...animeMapper.view(animeInfo),
    translations: {
      current: selectedTranslation,
      list: translations
    }
  };
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
