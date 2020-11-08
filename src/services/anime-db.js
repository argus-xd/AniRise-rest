const axios = require("axios");
const { animeDb } = require("../config");
const miniSearch = require("minisearch");
const animeSorter = require("../utils/anime-sorter");

const searchEngine = new miniSearch({
  fields: ["title", "title_orig"],
  storeFields: ["shikimori_id", "title"]
});

let cachedAnime = [];
const searchResultsLimit = 30;

const animeList = () => cachedAnime;

const animeSearch = searchTerm => {
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

  return result;
};

const updateCache = async () => {
  const timeElapsedLabel = "Cache update elapsed time";
  console.time(timeElapsedLabel);

  let downloadedAnime = [];

  for (const dumpName of animeDb.dumpsList) {
    const dumpAnime = await downloadDump(dumpName);
    downloadedAnime = [...downloadedAnime, ...dumpAnime];
  }

  downloadedAnime = downloadedAnime.sort(animeSorter.select("date", "desc"));
  const uniqueAnime = downloadedAnime.filter((anime, index) => {
    const foundIndex = downloadedAnime.findIndex(
      found => found.shikimori_id === anime.shikimori_id
    );

    return index === foundIndex;
  });

  searchEngine.removeAll();
  searchEngine.addAll(uniqueAnime);
  cachedAnime = downloadedAnime;

  console.log("Anime in cache: " + cachedAnime.length);
  console.timeEnd(timeElapsedLabel);
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
