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
            <title>${anime.title}</title>
            <playlist_url>${apiHost}/tv/anime/${anime.shikimoriId}</playlist_url>
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

  return `<items>\n${items.join("")}\n</items>`;
};

const viewAnime = async ({ params }) => {
  const anime = await animeService.getById(Number(params.id));

  return anime;

  return `
    <items>
        <channel>
            
        </channel>
    </items>
  `;
  // let link = encodeURIComponent(request.params.link);
  // const getInfo = await getAnimeById(request.params.id).then(r => {
  //   return r["results"][0];
  // });
  //
  // let kinopoisk_id = getInfo["kinopoisk_id"];
  // let meterialData = getInfo["material_data"];
  // let last_episode = getInfo["last_episode"] || 1;
  // let episodes_count = getInfo["episodes_count"] || 1;
  //
  // let list = "";
  // list += `<items>\n`;
  // let numSeasonsArr = getInfo["seasons"]
  //   ? Object.keys(getInfo["seasons"])
  //   : [0];
  //
  // numSeasonsArr.forEach(seasonsNum => {
  //   last_episode = getInfo["seasons"]
  //     ? Object.values(getInfo["seasons"][seasonsNum]["episodes"]).length
  //     : "1";
  //
  //   for (let i = 1; i <= last_episode; i++) {
  //     list += `<channel>\n`;
  //     list += `<title>  <![CDATA[Серия: ${i} ]]>   </title>\n`;
  //     list += `<stream_url>${apiHost}/get_link/${link}/${request.params.id}/${i}/${seasonsNum}</stream_url>\n`;
  //     try {
  //       list += `<description>
  //       <img style='float:left' width=200 height=auto src='${apiHost}/kinoposk/${kinopoisk_id}'>\n
  //       ${meterialData["title"]}/${meterialData["title_en"]} <br>
  //       Год: ${meterialData["year"]}    <br>
  //       Сезон : ${seasonsNum}  <br>
  //       Эпизодов : ${i} / ${episodes_count}<br>
  //       Длительность: ${meterialData["duration"]}    <br>
  //       Жанр: ${meterialData["genres"].join(", ")}    <br>
  //       Рейтинг Кинопоиск: ${meterialData["kinopoisk_rating"]}    <br>
  //       Рейтинг imdb: ${meterialData["imdb_rating"]}    <br>
  //       Описание: ${meterialData["description"]}    <br>
  //
  //       </description>`;
  //     } catch (error) {
  //       list += `<description> ${error}
  //           </description>`;
  //     }
  //
  //     list += `<logo_30x30> </logo_30x30>`;
  //     list += `</channel>`;
  //   }
  // });
  // list += `</items>\n`;
  //
  // res.send(list);
};

module.exports = {
  mainPage,
  search,
  viewAnime
};
