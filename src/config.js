module.exports = {
  clients: {
    kodik: {
      authToken: process.env.KODIK_AUTH_TOKEN,
      url: "https://kodikapi.com"
    }
  },
  serviceHost: "localhost",
  restPort: process.env.REST_PORT || 8080
};
