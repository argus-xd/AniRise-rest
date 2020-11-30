const defaultBanner =
  "https://www.fortressofsolitude.co.za/wp-content/uploads/2019/05/The-15-Most-Powerful-Anime-Characters-Of-All-Time-scaled.jpg";

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
    updatedAt: anime.updated_at
  }),
  dbToCache: ({ shikimoriData, updatedAt, ...restFields }) => ({
    shikimoriData: JSON.parse(shikimoriData ?? "{}"),
    updatedAt: new Date(updatedAt),
    ...restFields
  }),
  cacheToView: anime => ({
    id: anime.shikimoriId,
    type: anime.type,
    title: anime.shikimoriTitle || anime.title,
    titleEnglish: anime.shikimoriTitleEng || anime.titleOriginal,
    episodes: anime.episodes,
    poster: anime.shikimoriData?.poster || anime.poster,
    banner: anime.banner || defaultBanner,
    description: anime.shikimoriData?.description || anime.description,
    rating: anime.rating,
    shikimoriUrl: anime.shikimoriData?.url || "",
    genres: anime.shikimoriData?.genres || []
  }),
  cacheToList: anime => ({
    title: anime.shikimoriTitle || anime.title,
    titleEnglish: anime.shikimoriTitleEng || anime.titleOriginal,
    shikimoriId: anime.shikimoriId,
    updatedAt: anime.updatedAt,
    rating: anime.rating,
    poster: anime.shikimoriData?.poster || anime.poster
  })
};
