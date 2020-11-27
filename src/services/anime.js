const kodikApi = require("../clients/kodik");
const cacheContainer = require("../cache-container");
const rangeNumber = require("../utils/range-number");
const animeSorter = require("../utils/anime-sorter");
const searchService = require("./search");

const search = searchTerm => searchService(searchTerm);

const getList = (limit = 100, sortField, sortDirection = "desc") => {
  const correctLimit = rangeNumber(limit, 1, cacheContainer.animeList().length);
  const selectedSort = animeSorter.select(sortField, sortDirection);

  return cacheContainer
    .animeList()
    .sort(selectedSort)
    .slice(0, correctLimit);
};

const getById = async id => {
  return cacheContainer.animeList().find(anime => anime.shikimoriId === id);
};

const getTranslations = async animeId => {
  const translations = await translationsListByShikimoriId(animeId);

  const animeInfoList = (
    await Promise.allSettled(
      translations.map(({ id }) => getAnimeByTranslatorId(id))
    )
  ).filter(
    ({ status, value }) => status === "fulfilled" && value.episodes.length
  );

  if (!animeInfoList.length) throw "No anime found";

  return animeInfoList
    .map(({ value: animeInfo }) => {
      const firstEpisode = animeInfo.episodes[0].number;
      const lastEpisode =
        animeInfo.episodes[animeInfo.episodes.length - 1].number;
      const episodeNumbers = animeInfo.episodes.map(ep => ep.number);

      return {
        id: animeInfo.id,
        translator: animeInfo.translation.title,
        type: animeInfo.translation.type,
        episodes: {
          from: firstEpisode,
          to: lastEpisode,
          list: episodeNumbers
        }
      };
    })
    .sort((a, b) => b.episodes.list.length - a.episodes.list.length);
};

const getEpisodePlaylist = async (episodeNumber, translation) => {
  const anime = await getAnimeByTranslatorId(translation);

  if (!anime) throw "No anime found";

  const episode = anime.episodes.find(
    episode => episode.number === Number(episodeNumber)
  );

  if (!episode) throw "No episode found";

  return kodikApi.videoPlaylist(episode.link);
};

const getAnimeByTranslatorId = async translatorId => {
  const animeList = await kodikApi.search({
    id: translatorId,
    with_episodes: true,
    with_material_data: true
  });

  if (!animeList.length) return null;

  return animeList.map(({ seasons, ...anime }) => {
    const episodes = getEpisodesFromAnime(anime, seasons);
    return {
      ...anime,
      episodes
    };
  })[0];
};

const translationsListByShikimoriId = async id => {
  const dubsList = await cacheContainer.animeListFull().filter(anime => {
    return anime.shikimoriId === id;
  });

  return dubsList.map(anime => ({
    id: anime.translationId,
    translator: anime.translator
  }));
};

const getEpisodesFromAnime = (anime, seasons) => {
  if (anime.type === "anime") {
    return [{ number: 1, link: anime.link }];
  }

  const lastSeason = anime.last_season || 1;
  const episodes = seasons[lastSeason].episodes;

  return Object.entries(episodes).map(([episode, link]) => ({
    number: Number(episode),
    link
  }));
};

module.exports = {
  search,
  getById,
  getList,
  getTranslations,
  getEpisodePlaylist
};
