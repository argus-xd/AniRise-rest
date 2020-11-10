const axios = require("axios");
const config = require("./config").cacheContainer;
const animeSorter = require("./utils/anime-sorter");
const events = require("events");

const eventEmitter = new events();

const on = (eventKey, callback) => eventEmitter.on(eventKey, callback);

const cache = {
  allAnime: [],
  uniqueAnime: []
};

const animeList = () => cache.uniqueAnime;
const animeListFull = () => cache.allAnime;

const updateCache = async () => {
  const timeElapsedLabel = "Cache update elapsed time";
  console.time(timeElapsedLabel);

  let downloadedAnime = [];

  for (const dumpName of config.dumpsList) {
    const dumpAnime = await downloadDump(dumpName);
    downloadedAnime = [...downloadedAnime, ...dumpAnime];
  }

  downloadedAnime = downloadedAnime.sort(animeSorter.select("date", "desc"));
  cache.allAnime = downloadedAnime;
  cache.uniqueAnime = downloadedAnime.filter((anime, index) => {
    const foundIndex = downloadedAnime.findIndex(
      found => found.shikimori_id === anime.shikimori_id
    );

    return index === foundIndex;
  });

  console.log(
    `Anime in cache: total(${cache.allAnime.length}); unique(${cache.uniqueAnime.length});`
  );
  console.timeEnd(timeElapsedLabel);
  eventEmitter.emit("cache:updated", true);
};

const downloadDump = dumpName => {
  return axios
    .get(`${config.dumpsHost}/${dumpName}`)
    .then(({ data }) => data)
    .catch(() => []);
};

setInterval(() => updateCache(), config.cacheUpdateIntervalMinutes * 60000);

module.exports = {
  on,
  updateCache,
  animeList,
  animeListFull
};
