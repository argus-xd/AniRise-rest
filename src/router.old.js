const express = require("express");
const router = express.Router();
const { kodikController, searchController } = require("./controllers");

router.get(
  "/get_link/:link/:id/:episode/:season",
  kodikController.getLinkController
);

router.get("/search/", kodikController.searchController);
router.get("/list/:link/:id/:count/:season", kodikController.listController);
router.get("/kinoposk/:kinoposkID", kodikController.kinoposk);

router.get("/api-list/", kodikController.apiList);
router.get("/api-list-top", kodikController.apiListTop);
router.get("/api-search/:name", kodikController.apiSearch);
router.get("/api-search-id/:shikimori_id", kodikController.apiSearchId);
router.get("/api-serial-id/:serial_id", kodikController.ApiGetAnimeById);
router.get(
  "/api-get-url/:serial_id/:season/:episode",
  kodikController.apiGetLinks
);

router.get("/api-franchise/:serial_id", kodikController.apiFranchise);
router.get("/api-shiki-id/:id", kodikController.apiShkiGetById);

module.exports = router;
