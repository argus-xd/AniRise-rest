module.exports = {
  rawToDb: anime => ({
    shikimoriId: anime.shikimori_id,
    type: anime.type,
    title: anime.title,
    titleOriginal: anime.title_orig,
    translationId: anime.id,
    translator: anime.translation?.title || "",
    episodes: anime.episodes_count || 1,
    poster: anime.material_data?.poster_url || "",
    description: anime.material_data?.description || "",
    rating: anime.material_data?.shikimori_rating || "",
    needUpdateInfo: 1,
    updatedAt: new Date(anime.updated_at)
  }),
  dbToView: anime => ({
    id: anime.shikimoriId,
    type: anime.type,
    title: anime.title,
    titleOriginal: anime.titleOriginal,
    episodes: anime.episodes,
    poster: anime.poster,
    description: anime.description,
    rating: anime.rating
  }),
  dbToList: anime => ({
    title: anime.title,
    shikimoriId: anime.shikimoriId,
    updated_at: anime.updated_at,
    rating: anime.rating,
    poster: anime.poster
  })
};
