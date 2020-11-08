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
      videoUrl: "http://kodik.cc/video-information",
      refSign:
        "208d2a75f78d8afe7a1c73c2d97fd3ce07534666ab4405369f4f8705a9741144",
      hash2: "OErmnYyYA4wHwOP"
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
    cacheUpdateIntervalMinutes: process.env.CACHE_UPDATE_INTERVAL_MINUTES || 60
  }
};
