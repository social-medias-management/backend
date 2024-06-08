const express = require("express");

const {
  saveFacebookPageDetail,
  saveFacebookPost,
  getFacebookPost,
} = require("../controllers/facebookController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/facebook-page", authenticateUser, saveFacebookPageDetail);
router.post("/facebook-page-post", authenticateUser, saveFacebookPost);
router.get("/fb-page-post", authenticateUser, getFacebookPost);

module.exports = router;
