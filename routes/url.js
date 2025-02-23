const express = require("express");
const { generateNewShortURL, redirectToOriginalURL, getAnalytics, deleteAllShortURLs } = require("../controllers/url");

const router = express.Router();

router.post("/", generateNewShortURL);
router.get("/:shortId", redirectToOriginalURL);
router.get("/analytics/:shortId", getAnalytics);
router.post("/deleteAll", deleteAllShortURLs);

module.exports = router;
