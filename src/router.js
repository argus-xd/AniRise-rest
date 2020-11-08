const express = require("express");
const router = express.Router();
const { animeController } = require("./controllers");

const routes = [
  ["/anime/", animeController.animeList],
  ["/anime/:id(\\d+)/?$", animeController.animeById],
  ["/anime/:id(\\d+)/translations/", animeController.animeTranslations],
  ["/anime/:id(\\d+)/episodes/:ep(\\d+)/?$", animeController.episodeSource],
  ["/anime/search/", animeController.animeSearch]
];

routes.forEach(([path, handler, method = "get"]) => {
  router[method](path, async (request, response) => {
    const result = await handler(request, response);
    response.send(typeof result === "number" ? result.toString() : result);
  });
});

router.get("/favicon.ico", (req, res) => res.status(204));

module.exports = router;
