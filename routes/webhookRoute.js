const express = require("express");
const { WebHook } = require("../controllers/webhookController");

const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.get("/callback", WebHook);

module.exports = router;
