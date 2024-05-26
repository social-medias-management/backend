const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

const { saveToken } = require("../controllers/tokenController");

router.post("/token-save", authenticateUser, saveToken);

module.exports = router;
