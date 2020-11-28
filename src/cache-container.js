const axios = require("axios");
const config = require("./config").cacheContainer;
const animeMapper = require("./utils/anime-mapper");
const animeRepository = require("./repositories/anime");

const cache = {
  allAnime: [],
  uniqueAnime: []
};

const animeList = () => cache.uniqueAnime;
const animeListFull = () => cache.allAnime;

const init = async () => {
  const timeElapsedLabel = "Cache initialized in";
  console.time(timeElapsedLabel);
  await loadAnimeFromDb();
  console.timeEnd(timeElapsedLabel);

  updateCache();
  setInterval(() => updateCache(), config.cacheUpdateIntervalMinutes * 60000);
};

const loadAnimeFromDb = async () => {
  cache.allAnime = await animeRepository.getAll();
  cache.uniqueAnime = cache.allAnime.filter((anime, index) => {
    const foundIndex = cache.allAnime.findIndex(
      found => found.shikimoriId === anime.shikimoriId
    );

    return index === foundIndex;
  });
};

const updateCache = async () => {
  const animeToUpdate = [];

  for (const dumpName of config.dumpsList) {
    const animeList = await downloadDump(dumpName);

    for (const rawAnime of animeList) {
      const anime = animeMapper.rawToDb(rawAnime);
      const needUpdate = animeNeedUpdate(anime);

      if (needUpdate) {
        animeToUpdate.push(anime);
      }
    }
  }

  if (animeToUpdate.length) {
    await animeRepository.insert(animeToUpdate);
    loadAnimeFromDb();
  }
};

const animeNeedUpdate = anime => {
  const foundAnime = cache.allAnime.find(cached => cached.id === anime.id);

  if (!foundAnime) {
    return true;
  }

  return foundAnime.updatedAt - anime.updatedAt !== 0;
};

const downloadDump = dumpName => {
  return axios
    .get(`${config.dumpsHost}/${dumpName}`)
    .then(({ data }) => data)
    .catch(() => []);
};

module.exports = {
  init,
  animeList,
  animeListFull
};
