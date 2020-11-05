const get = require("lodash.get");

module.exports = {
  list: anime => ({
    title: anime.title,
    shikimoriId: anime.shikimori_id,
    updated_at: anime.updated_at,
    rating: get(anime, "material_data.shikimori_rating", 0),
    poster: get(anime, "material_data.poster_url", "")
  })
};
