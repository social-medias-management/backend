const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const { saveToken } = require("../controllers/tokenController");

const router = express.Router();

router.post("/token-save", authenticateUser, saveToken);

module.exports = router;
