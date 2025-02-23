const express = require("express");
const path = require("path");
const { connecttomongodb } = require("./connect");
const URL = require("./module/url");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");

const app = express();
const PORT = 9001;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use("/", staticRoute);
app.use("/url", urlRoute);

// Connect to MongoDB
connecttomongodb("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Serve home page
app.get("/test", async (req, res) => {
  try {
    const allUrls = await URL.find({});
    return res.render("home", { urls: allUrls });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Redirect from short URL
app.get("/:shortid", async (req, res) => {
  try {
    const shortId = req.params.shortid;

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
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
