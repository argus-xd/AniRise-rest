const express = require("express");
const cors = require("cors");
const router = require("./router");
const cacheContainer = require("./cache-container");

const { restPort } = require("./config");

(async () => {
  await cacheContainer.init();

  const app = express();

  app.use(cors());
  app.use(router);

  app.listen(restPort, () => {
    console.log("Rest API started on: " + restPort);
  });
})();
