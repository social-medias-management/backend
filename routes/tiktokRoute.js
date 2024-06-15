const express = require("express");
const {
  userAuthorize,
  authCallback,
} = require("../controllers/tiktokController");

const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/qauth", authenticateUser, userAuthorize);
router.get("/authCallback", authenticateUser, userAuthorize);

module.exports = router;
