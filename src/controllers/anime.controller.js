const animeService = require("../services/anime");
const animeMapper = require("../utils/anime-mapper");

const animeById = async ({ params }, response) => {
  const anime = await animeService.getAnimeById(params.id);
  if (!anime) {
    response.status(404);
    return { error: "No anime found" };
  }

  return animeMapper.view(anime);
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
