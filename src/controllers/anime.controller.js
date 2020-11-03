const kodikClient = require("../clients/kodik");
const animeDb = require("../services/anime-db");

const animeList = () => {
  return kodikClient.getAnimeList();
};

const animeSearch = ({ query }) => {
  return animeDb.animeSearch(query["title"] || "").map(anime => ({
    id: anime.id,
    title: anime.title,
    title_orig: anime.title_orig,
    shikimori_id: anime.shikimori_id,
    material_data: {
      poster_url: anime.material_data.poster_url
    }
  }));
};

module.exports = {
  animeList,
  animeSearch
};
