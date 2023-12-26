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
  const [domain, type, id, hash] = episodeLink.split("/").filter(x => x);
  const gviLink = await videoGetter.gviLinksSrc({ type, id, hash });

  return [{ src: gviLink, size: 720, type }];
};

module.exports = {
  list,
  search,
  videoPlaylist
};
