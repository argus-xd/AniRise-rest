const { url, authToken } = require("../config").clients.kodik;
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

module.exports = {
  list,
  search
};
