const config = require("../config").clients.shikimori;

const client = require("axios").create({
  baseURL: config.url
});

const simpleGetRequest = endpoint => {
  return client
    .get(endpoint)
    .then(({ data }) => data)
    .catch(() => []);
};

const animeById = id => {
  return simpleGetRequest(`/api/animes/${id}`);
};

const franchiseById = id => {
  return simpleGetRequest(`/api/animes/${id}/franchise`);
};

const infoById = async id => {
  const animeInfo = await animeById(id);
  const franchise = await franchiseById(id);

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

module.exports = { animeById, franchiseById, infoById };
