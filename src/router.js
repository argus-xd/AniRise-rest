const express = require("express");
const router = express.Router();
const { animeController } = require("./controllers");

const routes = [["/anime/", animeController.animeList]];

routes.forEach(([path, handler, method = "get"]) => {
  router[method](path, async (request, response) => {
    const result = await handler(request, response);
    response.send(typeof result === "number" ? result.toString() : result);
  });
});

module.exports = router;
