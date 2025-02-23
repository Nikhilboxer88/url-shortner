const shortId = require("shortid");
const URL = require("../module/url");

// Generate a new short URL
async function generateNewShortURL(req, res) {
    try {
        const { redirectUrl } = req.body;
        if (!redirectUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        const shortIdValue = shortId.generate();

        const newURL = await URL.create({
            shortId: shortIdValue,
            redirectUrl,
            visitHistory: [],
        });

        return res.json({ id: shortIdValue, shortUrl: `http://localhost:9001/${shortIdValue}` });
    } catch (error) {
        console.error("Error generating short URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Redirect to the original URL using short ID
async function redirectToOriginalURL(req, res) {
    try {
        const { shortId } = req.params;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error("Error in redirecting:", error);
        return res.status(500).send("Internal Server Error");
    }
}

// Get analytics of a shortened URL
async function getAnalytics(req, res) {
    try {
        const { shortId } = req.params;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Delete all shortened links
async function deleteAllShortURLs(req, res) {
    try {
        await URL.deleteMany({});
        return res.json({ success: true, message: "All links deleted successfully" });
    } catch (error) {
        console.error("Error deleting all links:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { generateNewShortURL, redirectToOriginalURL, getAnalytics, deleteAllShortURLs };
