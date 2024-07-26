const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

const {
  createShedule,
  getShedulePost,
} = require("../controllers/SheduleController");
const { uploadPost } = require("../controllers/uploadPostControllet");

router.post("/create-shedule", authenticateUser, createShedule);
router.post("/uploads", authenticateUser, uploadPost);
router.get("/shedule-post", authenticateUser, getShedulePost);
router.delete("/", authenticateUser, getShedulePost);

module.exports = router;
