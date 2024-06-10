const express = require("express");

const { saveYoutubeToken } = require("../controllers/youtubeController");
const {
  YoutubeVideo,
  getYoutubeVideo,
} = require("../controllers/YoutubeVideoController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/yt-token", authenticateUser, saveYoutubeToken);
router.get("/yt-content", authenticateUser, getYoutubeVideo);
router.post("/yt-save-content", authenticateUser, YoutubeVideo);

module.exports = router;
