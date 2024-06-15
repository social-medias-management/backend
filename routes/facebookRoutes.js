const express = require("express");

const {
  saveFacebookPageDetail,
  saveFacebookPost,
  getFacebookPost,
  deleteFacebookUser,
} = require("../controllers/facebookController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/facebook-page", authenticateUser, saveFacebookPageDetail);
router.post("/facebook-page-post", authenticateUser, saveFacebookPost);
router.get("/fb-page-post", authenticateUser, getFacebookPost);
router.delete("/fb-delete", authenticateUser, deleteFacebookUser);

module.exports = router;
