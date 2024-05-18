const express = require("express");

const {
  register,
  login,
  logout,
  forgotPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forget-password", forgotPassword);

module.exports = router;
