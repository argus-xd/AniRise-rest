const config = require("../config").clients.kodik;
const client = require("axios").create({
  baseURL: config.url
});

const simpleGetRequest = (endpoint, params = {}) => {
  return client
    .get(endpoint, { params: { token: config.authToken, ...params } })
    .then(({ data }) => data.results)
    .catch(() => []);
};

const list = params => simpleGetRequest("/list", params);
const search = params => simpleGetRequest("/search", params);

const videoPlaylist = (id, type, hash) => {
  return client
    .post(
      config.videoUrl,
      new URLSearchParams({
        ref: "",
        ref_sign: config.refSign,
        type,
        id,
        hash,
        hash2: config.hash2
      }).toString()
    )
    .then(({ data }) =>
      Object.entries(data.links).map(([size, [{ src, type }]]) => ({
        src: "https:" + src.replace(":hls:manifest.m3u8", ""),
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
