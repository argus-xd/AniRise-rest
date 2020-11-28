const animeService = require("../services/anime");
const animeMapper = require("../utils/anime-mapper");
const playListService = require("../services/playlist");

const animeById = async ({ params }, response) => {
  const anime = await animeService.getById(Number(params.id));
  if (!anime) {
    response.status(404);
    return { error: "No anime found" };
  }

  return animeMapper.dbToView(anime);
};

const animeList = ({ query }) => {
  return animeService
    .getList(query["limit"], query["sort-field"], query["sort-direction"])
    .map(animeMapper.dbToList);
};

const animeSearch = async ({ query }) => {
  const searchResult = await animeService.search(query["title"]);
  return searchResult.map(animeMapper.dbToList);
};

const animeTranslations = ({ params }, response) => {
  try {
    return animeService.getTranslations(Number(params.id));
  } catch (error) {
    response.status(404);
    return { error };
  }
};

const episodePlaylist = async ({ params }, response) => {
  try {
    const playList = await animeService.getEpisodePlaylist(
      params.episode,
      params.translation
    );

    response.type("application/x-mpegURL");
    return playListService.makeMaster(playList);
  } catch (error) {
    response.status(404);
    if (typeof error !== "string") error = error.message;
    return { error };
  }
};

module.exports = {
  animeList,
  animeById,
  animeSearch,
  episodePlaylist,
  animeTranslations
};
