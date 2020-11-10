const config = require("../config").clients.kodik;
const { timestamp } = require("../utils/date");
const client = require("axios").create({
  baseURL: config.url
});

const videoGetter = {
  lastUpdate: 0,
  isActual: () =>
    videoGetter.lastUpdate > timestamp() - config.videoGetterUpdateIntervalMs,
  update: async () => {
    videoGetter.lastUpdate = timestamp();
  }
};

const simpleGetRequest = (endpoint, params = {}) => {
  return client
    .get(endpoint, { params: { token: config.authToken, ...params } })
    .then(({ data }) => data.results)
    .catch(() => []);
};

const list = params => simpleGetRequest("/list", params);
const search = params => simpleGetRequest("/search", params);

const videoPlaylist = episodeLink => {
  const [, type, id, hash] = episodeLink.split("/").filter(x => x);

  return client
    .post(
      config.videoUrl,
      new URLSearchParams({
        ref: "",
        ref_sign: config.refSign,
        bad_user: "false",
        type,
        id,
        hash,
        hash2: config.hash2
      }).toString()
    )
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
