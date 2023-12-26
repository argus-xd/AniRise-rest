const { videoGetterUpdateInterval } = require("../../config").clients.kodik;
const { timestamp } = require("../../utils/date");
const axios = require("axios");

let getterUrl = "";
const params = {
  ref: "",
  ref_sign: "",
  bad_user: "false",
  d_sign: "",
  pd: "",
  pd_sign: ""
};

let lastUpdate = 0;

const configIsActual = () =>
  lastUpdate > timestamp() - videoGetterUpdateInterval;

const updateConfig = async playerUrl => {
  const html = await axios
    .get("https:" + playerUrl)
    .then(({ data }) => data)
    .catch(() => "");

  if (!html.length) return;

  const matches = html.matchAll(/var (.*?) = "(.*?)"/g);
  const [scriptLink] = html.match(/\/assets.*.js/);

  for (const [, varName, varValue] of matches) {
    if (params.hasOwnProperty(varName)) {
      params[varName] = varValue;
    } else if (varName === "domain") {
      params.d = varValue;
    }
  }

  const scriptBody = await axios
    .get("https://" + params.pd + scriptLink)
    .then(({ data }) => data)
    .catch(() => "");

  const [, getterEndpoint] = scriptBody.match(/url:"(\/.*?)"/);
  const [, hash2] = scriptBody.match(/hash2:"(.*?)"/);

  getterUrl = "https://" + params.d + getterEndpoint;
  params.hash2 = hash2;

  lastUpdate = timestamp();
};

const url = () => {
  return getterUrl;
};

const requestParams = async episodeLink => {
  const [domain, type, id, hash] = episodeLink.split("/").filter(x => x);

  if (!configIsActual()) {
    const playerUrl = getPlayerUrl(domain, episodeLink);
    await updateConfig(playerUrl);
  }

  return {
    ...params,
    id,
    type,
    hash
  };
};

const getPlayerUrl = (domain, episodeLink) => {
  return episodeLink.replace(`${domain}/`, `${domain}/go/`);
};

const deCodeLink = src => {
  const srcReverse = src
    .split("")
    .reverse()
    .join("");
  return Buffer.from(srcReverse, "base64").toString();
};

const clientGvi = (params = {}) => {
  return axios
    .postForm("http://aniqit.com/gvi", params)
    .then(({ data }) => {
      return data;
    })
    .catch(error => console.log(error));
};

const gviLinksSrc = async ({ type, id, hash, quality = "720", hls = true }) => {
  const data = await clientGvi({ type, id, hash });
  const links = data["links"];
  const keyMaxQuality = Object.keys(links).at(-1);
  const srcHash = links[quality][0].src;
  const src = deCodeLink(srcHash);
  const mp4 = src.split(":hls");

  return hls ? src : mp4[0];
};

module.exports = {
  url,
  requestParams,
  gviLinksSrc
};
