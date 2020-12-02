const animeService = require("../services/anime");
const animeMapper = require("../utils/anime-mapper");
const playListService = require("../services/playlist");

const animeById = ({ params }, response) => {
  const anime = animeService.getById(Number(params.id));
  if (!anime) {
    response.status(404);
    return { error: "No anime found" };
  }

  const result = animeMapper.cacheToView(anime);

  result.relations = result.relations
    .map(({ id: animeId, date: releaseDate }) => {
      const anime = animeService.getById(animeId);
      if (!anime) return null;

      return { ...animeMapper.cacheToList(anime), releaseDate };
    })
    .filter(exists => exists);

  return result;
};

const animeList = ({ query }) => {
  return animeService
    .getList(query["limit"], query["sort-field"], query["sort-direction"])
    .map(animeMapper.cacheToList);
};

const animeSearch = async ({ query }) => {
  const searchResult = await animeService.search(query["title"]);
  return searchResult.map(animeMapper.cacheToList);
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
