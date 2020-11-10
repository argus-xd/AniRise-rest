const envArray = (variableName, defaultValue = "") => {
  return (process.env[variableName] || defaultValue)
    .split(",")
    .map(x => x.trim())
    .filter(x => x.length);
};

module.exports = {
  clients: {
    kodik: {
      authToken: process.env.KODIK_AUTH_TOKEN,
      url: "https://kodikapi.com",
      videoGetterUpdateInterval: 300
    }
  },
  serviceHost: "localhost",
  restPort: process.env.REST_PORT || 8080,
  cacheContainer: {
    dumpsHost: process.env.ANIME_DUMPS_HOST || "https://dumps.kodik.biz",
    dumpsList: envArray(
      "CACHE_DUMPS_LIST",
      "films/anime.json, serials/anime-serial.json"
    ),
    cacheUpdateIntervalMinutes: process.env.CACHE_UPDATE_INTERVAL_MINUTES || 30
  }
};
