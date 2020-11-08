const animeService = require("../services/anime");
const animeMapper = require("../utils/anime-mapper");

const animeById = async ({ params }, response) => {
  const anime = await animeService.getById(params.id);
  if (!anime) {
    response.status(404);
    return { error: "No anime found" };
  }

  return animeMapper.view(anime);
};

const animeList = ({ query }) => {
  return animeService
    .getList(query["limit"], query["sort-field"], query["sort-direction"])
    .map(animeMapper.list);
};

const animeSearch = ({ query }) => {
  return animeService.search(query["title"] || "").map(animeMapper.list);
};

const episodeSource = ({ params, query }) => {
  return "test";
};

const animeTranslations = ({ params, query }, response) => {
  try {
    return animeService.getTranslations(params.id, query["translation"]);
  } catch (error) {
    response.status(404);
    return { error };
  }
};

module.exports = {
  animeList,
  animeById,
  animeSearch,
  episodeSource,
  animeTranslations
};
