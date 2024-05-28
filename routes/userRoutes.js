const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

const {
  showCurrentUser,
  updateUserPassword,
} = require("../controllers/userController");

router.get("/showMe", authenticateUser, showCurrentUser);
router.post("/update-password", authenticateUser, updateUserPassword);
module.exports = router;
