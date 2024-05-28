const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const {
  saveToken,
  userPlatform,
} = require("../controllers/platformController");

const router = express.Router();

router.post("/token-save", authenticateUser, saveToken);
router.get("/user-platform", authenticateUser, userPlatform);

module.exports = router;
