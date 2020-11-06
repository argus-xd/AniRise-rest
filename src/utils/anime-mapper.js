const get = require("lodash.get");

module.exports = {
  view: anime => ({
    id: anime.shikimori_id,
    type: anime.type,
    title: anime.title,
    titleOriginal: anime.title_orig,
    poster: get(anime, "material_data.poster_url", ""),
    description: get(anime, "material_data.description", ""),
    genres: get(anime, "material_data.anime_genres", []),
    rating: get(anime, "material_data.shikimori_rating", 0)
  }),
  list: anime => ({
    title: anime.title,
    shikimoriId: anime.shikimori_id,
    updated_at: anime.updated_at,
    rating: get(anime, "material_data.shikimori_rating", 0),
    poster: get(anime, "material_data.poster_url", "")
  })
};
