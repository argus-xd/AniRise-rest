const envArray = (variableName, defaultValue = "") => {
  return (process.env[variableName] || defaultValue)
    .split(",")
    .map(x => x.trim())
    .filter(x => x.length);
};

const restPort = process.env.REST_PORT || 8080;

module.exports = {
  apiHost: "http://127.0.0.1:" + restPort || process.env.API_HOST,
  sphinx: {
    host: process.env.SPHINX_HOST || "127.0.0.1",
    port: 9312
  },
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    pass: process.env.MYSQL_PASS || "",
    db: process.env.MYSQL_DB || ""
  },
  clients: {
    kodik: {
      authToken: process.env.KODIK_AUTH_TOKEN,
      url: "https://kodikapi.com",
      videoGetterUpdateInterval: 300
    }
  },
  serviceHost: "localhost",
  restPort,
  cacheContainer: {
    dumpsHost: process.env.ANIME_DUMPS_HOST || "https://dumps.kodik.biz",
    dumpsList: envArray(
      "CACHE_DUMPS_LIST",
      "films/anime.json, serials/anime-serial.json"
    ),
    cacheUpdateIntervalMinutes: process.env.CACHE_UPDATE_INTERVAL_MINUTES || 30
  }
};
