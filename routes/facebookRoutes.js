const express = require("express");

const { saveFacebookPageDetail } = require("../controllers/facebookController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/facebook-page", authenticateUser, saveFacebookPageDetail);

module.exports = router;
