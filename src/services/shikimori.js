const client = require("../clients/shikimori");

const infoById = async id => {
  const animeInfo = await client.animeById(id);
  const franchise = await client.franchiseById(id);

  return {
    title: animeInfo.russian,
    titleEng: animeInfo.name,
    url: animeInfo.url,
    poster: animeInfo.image?.original ?? "",
    description: animeInfo.description,
    genres: animeInfo.genres.map(genre => genre.name),
    franchise: (franchise?.nodes ?? []).map(({ id, date }) => ({
      id,
      date
    }))
  };
};

module.exports = { infoById };
