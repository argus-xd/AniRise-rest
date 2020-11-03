const express = require("express");
const router = express.Router();
const { animeController } = require("./controllers");

const routes = [["/anime/", animeController.animeList]];

routes.forEach(([path, handler, method = "get"]) => {
  router[method](path, async (request, response) => {
    response.send(await handler(request, response));
  });
});

router.get("/anime/", animeController.animeList);

module.exports = router;
