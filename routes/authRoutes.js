const express = require("express");
const { authenticateUser } = require("../middleware/authentication");
const {} = require("../middleware/authentication");
const {
  register,
  login,
  logout,
  forgotPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.post("/forget-password", forgotPassword);

module.exports = router;
