const axios = require("axios");
const config = require("./config").cacheContainer;
const animeMapper = require("./utils/anime-mapper");
const animeRepository = require("./repositories/anime");
const shikimoriClient = require("./clients/shikimori");

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

  updateCache().then(() => {
    setInterval(() => updateCache(), config.cacheUpdateIntervalMinutes * 60000);
    setInterval(async () => {
      const animeToUpdate = cache.allAnime
        .filter(({ needUpdateInfo }) => needUpdateInfo)
        .slice(0, 10);

      for (const { shikimoriId } of animeToUpdate) {
        await updateAdditionalAnimeInfo(shikimoriId);
      }
    }, 20000);
  });
};

const loadAnimeFromDb = async () => {
  cache.allAnime = (await animeRepository.getAll()).map(
    ({ shikimoriData, ...restFields }) => ({
      shikimoriData: JSON.parse(shikimoriData ?? "{}"),
      ...restFields
    })
  );
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
    await loadAnimeFromDb();
  }
};

const updateAdditionalAnimeInfo = async shikimoriId => {
  const { title, titleEng, ...data } = await shikimoriClient.infoById(
    shikimoriId
  );
  if (title) {
    const updateList = [];
    cache.allAnime
      .filter(anime => anime.shikimoriId === shikimoriId)
      .forEach(anime => {
        anime.shikimoriTitle = title;
        anime.shikimoriTitleEng = titleEng;
        anime.shikimoriData = data;

        updateList.push({
          id: anime.id,
          needUpdateInfo: 0,
          shikimoriTitle: title,
          shikimoriTitleEng: titleEng,
          shikimoriData: JSON.stringify(data)
        });
      });

    animeRepository.insert(updateList);
  }
};

const animeNeedUpdate = anime => {
  const foundAnime = cache.allAnime.find(
    cached => cached.translationId === anime.translationId
  );

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
