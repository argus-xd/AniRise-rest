const config = require("../../config").clients.kodik;
const client = require("axios").create({
  baseURL: config.url
});

const videoGetter = require("./video-getter");

const simpleGetRequest = (endpoint, params = {}) => {
  return client
    .get(endpoint, { params: { token: config.authToken, ...params } })
    .then(({ data }) => data.results)
    .catch(() => []);
};

const list = params => simpleGetRequest("/list", params);
const search = params => simpleGetRequest("/search", params);

const videoPlaylist = async episodeLink => {
  const requestParams = await videoGetter.requestParams(episodeLink);

  return client
    .post(videoGetter.url(), new URLSearchParams(requestParams).toString())
    .then(({ data }) =>
      Object.entries(data.links).map(([size, [{ src, type }]]) => ({
        src,
        size,
        type
      }))
    );
};

module.exports = {
  list,
  search,
  videoPlaylist
};
