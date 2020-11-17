const get = require("lodash.get");

module.exports = {
  db: anime => ({
    id: anime.id,
    shikimoriId: anime.shikimori_id,
    type: anime.type,
    title: anime.title,
    titleOriginal: anime.title_orig,
    episodes: anime.episodes_count || 1,
    poster: anime.material_data?.poster_url || "",
    description: anime.material_data?.description || "",
    rating: anime.material_data?.shikimori_rating || "",
    updatedAt: anime.updated_at
  }),
  view: anime => ({
    id: anime.shikimoriId,
    type: anime.type,
    title: anime.title,
    titleOriginal: anime.titleOriginal,
    episodes: anime.episodes,
    poster: anime.poster,
    description: anime.description,
    rating: anime.rating
  }),
  list: anime => ({
    title: anime.title,
    shikimoriId: anime.shikimoriId,
    updated_at: anime.updated_at,
    rating: anime.rating,
    poster: anime.poster
  })
};
