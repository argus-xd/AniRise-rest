const axios = require("axios");
const { animeDb } = require("../config");

const timeElapsedLabels = {
  search: "Search time",
  cacheUpdate: "Cache update elapsed time"
};

let cachedAnime = [];

const animeList = () => cachedAnime;

const animeSearch = searchTerm => {
  console.time(timeElapsedLabels.search);
  const result = cachedAnime.filter(anime => {
    const titleMatched = anime.title.indexOf(searchTerm) >= 0;
    const titleOrigMatched = anime.title_orig.indexOf(searchTerm) >= 0;

    return titleMatched || titleOrigMatched;
  });

  console.log("Search term: " + searchTerm);
  console.log("Results found: " + result.length);
  console.timeEnd(timeElapsedLabels.search);

  return result;
};

const updateCache = async () => {
  console.time(timeElapsedLabels.cacheUpdate);

  const downloadedAnime = [];

  for (const dumpName of animeDb.dumpsList) {
    const dumpAnime = await downloadDump(dumpName);

    dumpAnime.forEach((anime, index) => {
      const foundIndex = dumpAnime.findIndex(
        found => found.shikimori_id === anime.shikimori_id
      );

      if (index !== foundIndex) {
        downloadedAnime.push(anime);
      }
    });
  }

  cachedAnime = downloadedAnime;

  console.log("Anime in cache: " + cachedAnime.length);
  console.timeEnd(timeElapsedLabels.cacheUpdate);
};

const downloadDump = dumpName => {
  return axios
    .get(`${animeDb.dumpsHost}/${dumpName}`)
    .then(({ data }) => data)
    .catch(() => []);
};

setInterval(() => updateCache(), animeDb.cacheUpdateIntervalMinutes * 60000);

module.exports = {
  updateCache,
  animeList,
  animeSearch
};
