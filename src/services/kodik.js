const kodikApi = require("../clients/kodik");

const getAnimeList = (limit = 100) => {
  return kodikApi.list({
    types: "anime-serial,anime",
    with_episodes: "true",
    with_material_data: "true",
    limit
  });
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
  const dubsList = await kodikApi.search({
    shikimori_id: id
  });

  return dubsList.map(anime => ({
    id: anime.id,
    translator: anime.translation.title,
    type: anime.translation.type
  }));
};

const getEpisodesFromAnime = (anime, seasons) => {
  if (anime.type === "anime") {
    return [{ episode: 1, link: anime.link }];
  }

  const lastSeason = anime.last_season || 1;
  const episodes = seasons[lastSeason].episodes;

  return Object.entries(episodes).map(([episode, link]) => ({
    episode,
    link
  }));
};

module.exports = {
  getAnimeList,
  getAnimeByTranslatorId,
  translationsListByShikimoriId
};
