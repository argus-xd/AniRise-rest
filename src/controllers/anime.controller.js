const animeService = require("../services/anime");
const animeMapper = require("../utils/anime-mapper");
const playListService = require("../services/playlist");

const animeById = async ({ params }, response) => {
  const anime = await animeService.getById(Number(params.id));
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

const animeTranslations = ({ params, query }, response) => {
  try {
    return animeService.getTranslations(
      Number(params.id),
      query["translation"]
    );
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
