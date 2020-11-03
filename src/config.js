module.exports = {
  clients: {
    kodik: {
      authToken: process.env.KODIK_AUTH_TOKEN,
      url: "https://kodikapi.com"
    }
  },
  serviceHost: "localhost",
  restPort: process.env.REST_PORT || 8080,
  cacheUpdateIntervalMinutes: process.env.CACHE_UPDATE_INTERVAL_MINUTES || 60
};
