const express = require("express");

const { saveYoutubeToken } = require("../controllers/youtubeController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/yt-token", authenticateUser, saveYoutubeToken);

module.exports = router;
