const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

const { showCurrentUser } = require("../controllers/userController");
router.route("/showMe").get(authenticateUser, showCurrentUser);

module.exports = router;
