const axios = require("axios");
const { animeDb } = require("../config");
const miniSearch = require("minisearch");
const animeSorter = require("../utils/anime-sorter");

const timeElapsedLabels = {
  search: "Search time",
  cacheUpdate: "Cache update elapsed time"
};

const searchEngine = new miniSearch({
  fields: ["title", "title_orig"],
  storeFields: ["shikimori_id", "title"]
});

let cachedAnime = [];
const searchResultsLimit = 30;

const animeList = () => cachedAnime;

const animeSearch = searchTerm => {
  console.time(timeElapsedLabels.search);

  const result = [];
  const searchResults = searchEngine.search(searchTerm, { fuzzy: 0.2 });

  for (const searchResult of searchResults) {
    const foundAnime = cachedAnime.find(
      anime => anime.shikimori_id === searchResult.shikimori_id
    );

    if (foundAnime) {
      result.push(foundAnime);
      if (result.length >= searchResultsLimit) {
        break;
      }
    }
  }

  console.timeEnd(timeElapsedLabels.search);

  return result;
};

const updateCache = async () => {
  console.time(timeElapsedLabels.cacheUpdate);

  const downloadedAnime = [];

  for (const dumpName of animeDb.dumpsList) {
    const dumpAnime = (await downloadDump(dumpName)).sort(
      animeSorter.select("date", "desc")
    );

    dumpAnime.forEach((anime, index) => {
      const foundIndex = dumpAnime.findIndex(
        found => found.shikimori_id === anime.shikimori_id
      );

      if (index === foundIndex) {
        downloadedAnime.push(anime);
      }
    });
  }

  searchEngine.removeAll();
  searchEngine.addAll(downloadedAnime);
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
