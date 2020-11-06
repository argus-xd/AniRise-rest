const { url, videoUrl, authToken } = require("../config").clients.kodik;
const client = require("axios").create({
  baseURL: url
});

const simpleGetRequest = (endpoint, params = {}) => {
  return client
    .get(endpoint, { params: { token: authToken, ...params } })
    .then(({ data }) => data.results)
    .catch(() => []);
};

const list = params => simpleGetRequest("/list", params);
const search = params => simpleGetRequest("/search", params);

const videoInfo = (id, type, hash) => {
  return client
    .post(
      videoUrl,
      new URLSearchParams({
        ref: "",
        ref_sign:
          "208d2a75f78d8afe7a1c73c2d97fd3ce07534666ab4405369f4f8705a9741144",
        type,
        id,
        hash
      }).toString()
    )
    .then(({ data }) => data);
};

module.exports = {
  list,
  search,
  videoInfo
};
