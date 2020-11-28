const express = require("express");
const router = express.Router();
const { animeController, tvController } = require("./controllers");

const routes = [
  ["/anime/", animeController.animeList],
  ["/anime/:id(\\d+)/?$", animeController.animeById],
  ["/anime/:id(\\d+)/translations/", animeController.animeTranslations],
  ["/anime/search/", animeController.animeSearch],
  ["/playlist/:translation/:episode(\\d+)/?$", animeController.episodePlaylist],
  ["/tv", tvController.mainPage],
  ["/tv/search/", tvController.search],
  ["/tv/anime/:translation", tvController.viewAnime]
];

routes.forEach(([path, handler, method = "get"]) => {
  router[method](path, async (request, response) => {
    const result = await handler(request, response);
    response.send(typeof result === "number" ? result.toString() : result);
  });
});

router.get("/favicon.ico", (req, res) => res.status(204));

module.exports = router;
