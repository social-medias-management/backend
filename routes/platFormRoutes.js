const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const {
  saveToken,
  userPlatform,
  getConnectedPlatForm,
} = require("../controllers/platformController");

const router = express.Router();

router.post("/token-save", authenticateUser, saveToken);
router.get("/user-platform", authenticateUser, userPlatform);
router.get("/connected-media", authenticateUser, userPlatform);

module.exports = router;
