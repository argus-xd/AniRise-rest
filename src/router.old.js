const express = require("express");
const router = express.Router();
const { kodikController } = require("./controllers");

router.get(
  "/get_link/:link/:id/:episode/:season",
  kodikController.getLinkController
);

router.get("/search/", kodikController.searchController);
router.get("/list/:link/:id/:count/:season", kodikController.listController);

module.exports = router;
