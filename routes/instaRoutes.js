const express = require("express");

const {
  saveInstaUser,
  SaveInstaPost,
  InstaGramPost,
  getInstagramUser,
  deleteInstaData,
} = require("../controllers/instaController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/save-insta-user", authenticateUser, saveInstaUser);
router.post("/save-insta-post", authenticateUser, SaveInstaPost);
router.get("/get-insta-post", authenticateUser, InstaGramPost);
router.get("/get-insta-user", authenticateUser, getInstagramUser);
router.delete("/insta-delete/:id", authenticateUser, deleteInstaData);

module.exports = router;
