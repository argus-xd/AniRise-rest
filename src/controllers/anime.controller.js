const animeService = require("../services/anime");
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
  return animeService
    .getAnimeList(query["limit"], query["sort-field"], query["sort-direction"])
    .map(animeMapper.list);
};

const animeSearch = ({ query }) => {
  return animeService.search(query["title"] || "").map(animeMapper.list);
};

module.exports = {
  animeList,
  animeById,
  animeSearch
};
