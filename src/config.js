const envArray = (variableName, defaultValue = "") => {
  return (process.env[variableName] || defaultValue)
    .split(",")
    .map(x => x.trim())
    .filter(x => x.length);
};

const restPort = process.env.REST_PORT || 3000;

module.exports = {
  apiHost: process.env.API_HOST || "http://127.0.0.1:" + restPort,
  sphinx: {
    host: process.env.SPHINX_HOST || "127.0.0.1",
    port: 9312
  },
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    user: process.env.MYSQL_USER || "root",
    pass: process.env.MYSQL_PASS || "",
    db: process.env.MYSQL_DB || "anime"
  },
  clients: {
    anilist: {
      url: "https://graphql.anilist.co"
    },
    shikimori: {
      url: "https://shikimori.one"
    },
    kodik: {
      authToken: process.env.KODIK_AUTH_TOKEN || 'f20af586686a913f6f5b8f2f8454bb5b',
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
