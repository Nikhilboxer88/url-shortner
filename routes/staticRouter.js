const express = require("express");
const URL = require("../module/url");

const router = express.Router();

router.get("/", async (req, res) => {
    const allUrls = await URL.find({}); // Fetch URLs from MongoDB
    res.render("home", { urls: allUrls }); // Pass 'urls' to EJS
});

module.exports = router;
