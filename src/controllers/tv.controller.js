const animeService = require("../services/anime");
const searchService = require("../services/search");
const cacheContainer = require("../cache-container");
const { apiHost } = require("../config");

const mainPage = () => {
  return `
    <items>
        <channel>
            <title>
                <![CDATA[Поиск]]>
            </title>
            <search_on>
                <![CDATA[Введите поисковую фразу]]>
            </search_on>
            <playlist_url>${apiHost}/tv/search</playlist_url>
            <description>
                <![CDATA[empty]]>
            </description>
        </channel>
        <channel>
            <title>
                <![CDATA[Новости]]>
            </title>
            <playlist_url>
                ${apiHost}/tv/search
            </playlist_url>
            <description>
            </description>
            <logo_30x30>
                <![CDATA[3]]>
            </logo_30x30>
        </channel>
    </items>
    `;
};

const search = async ({ query }) => {
  const searchTerm = query.search || "";
  const animeIds = await searchService(searchTerm, true);
  const animeList = cacheContainer
    .animeListFull()
    .filter(anime => animeIds.includes(anime.shikimoriId));

  return prepareListXml(animeList);
};

const prepareListXml = animeList => {
  const items = [];

  for (const anime of animeList) {
    items.push(`
        <channel>
            <title>${anime.title} - ${anime.translator}</title>
            <playlist_url>${apiHost}/tv/anime/${anime.translationId}</playlist_url>
            <description>
                <div style='font-size:24px'>
                    <img style='float:left' width=200 height=auto src='${anime.poster}'>
                    <span style='color:#89A5BF;'>${anime.title}</span>
                    <div style='color:gold;'>
                        Жанр: -<br/>
                        Год: -<br/>
                        Эпизоды: ${anime.episodes}<br/>
                        Посл.эпизод: ${anime.updatedAt}<br/>
                        Перевод: ${anime.translator}
                    </div>
                    ${anime.description}
                </div>
            </description>
            <logo_30x30>${apiHost}</logo_30x30>
        </channel>
    `);
  }

  return `<items>${items.join("")}</items>`;
};

const viewAnime = async ({ params }, response) => {
  const anime = await animeService.getAnimeByTranslationId(params.translation);

  if (!anime) {
    response.status(404);
    return "Anime not found";
  }

  const items = [];

  anime.episodes.forEach(({ number: episode }) => {
    items.push(`
        <channel>
            <title>Эпизод: ${episode}</title>
            <stream_url>${apiHost}/playlist/${anime.id}/${episode}/</stream_url>
            <description>
                <div style='font-size:24px'>
                    <img style='float:left' width=200 height=auto src='${anime.material_data.poster_url}'>
                    <span style='color:#89A5BF;'>${anime.title}</span>
                    <div style='color:gold;'>
                        Жанр: -<br/>
                        Год: -<br/>
                        Эпизоды: ${anime.episodes.length}<br/>
                        Посл.эпизод: ${anime.updated_at}<br/>
                        Перевод: ${anime.translation.title}
                    </div>
                    ${anime.material_data.description}
                </div>
            </description>
            <logo_30x30>${apiHost}</logo_30x30>
        </channel>
    `);
  });

  return `<items>${items.join("")}</items>`;
};

module.exports = {
  mainPage,
  search,
  viewAnime
};
