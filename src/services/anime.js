const kodikApi = require("../clients/kodik");
const cacheContainer = require("../cache-container");
const animeMapper = require("../utils/anime-mapper");

const getAnimeList = (limit = 100) => {
  return kodikApi.list({
    types: "anime-serial,anime",
    with_episodes: "true",
    with_material_data: "true",
    limit
  });
};

const getAnimeById = async (id, episode = 1, translation) => {
  const translations = await translationsListByShikimoriId(id);

  if (!translations.length) throw "No anime found";

  translation = (
    translations.find(tr => tr.id === translation) || translations[0]
  ).id;
  const animeInfo = await getAnimeByTranslatorId(translation);
  if (!animeInfo) throw "No anime found";

  const foundEpisode = animeInfo.episodes.find(ep => ep.number === episode);
  if (!foundEpisode) throw "No episode found";

  const totalEpisodes =
    animeInfo.episodes[animeInfo.episodes.length - 1].number;
  const playList = await getPlaylistByEpisodeLink(foundEpisode.link).catch();

  return {
    ...animeMapper.view(animeInfo),
    episodes: {
      current: episode,
      total: totalEpisodes,
      playList
    },
    translations: {
      current: translation,
      list: translations
    }
  };
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
  const dubsList = await cacheContainer.animeList().filter(anime => {
    return anime.shikimori_id === id;
  });

  return dubsList.map(anime => ({
    id: anime.id,
    translator: anime.translation.title,
    type: anime.translation.type
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

const getPlaylistByEpisodeLink = link => {
  const [, type, id, hash] = link.split("/").filter(x => x);

  return kodikApi.videoPlaylist(id, type, hash);
};

module.exports = {
  getAnimeById,
  getAnimeList
};
