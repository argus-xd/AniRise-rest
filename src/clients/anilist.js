const config = require("../config").clients.anilist;
const client = require("axios").create();

const simpleGetRequest = (query, variables) => {
  return client
    .post(config.url, JSON.stringify({ query, variables }), {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(({ data }) => data.data?.Media ?? {})
    .catch(() => {});
};

const animeBanner = async animeId => {
  const query = `
    query ($id: Int) {
      Media (idMal: $id, type: ANIME){
        bannerImage
      }
    }
    `;
  const result = await simpleGetRequest(query, { id: animeId });

  return result?.bannerImage;
};

module.exports = { animeBanner };
