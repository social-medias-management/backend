const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstagramUserSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  follows_count: { type: Number, default: 0 },
  followers_count: { type: Number, default: 0 },
  media_count: { type: Number, default: 0 },
  name: { type: String },
  profile_picture_url: { type: String },
  website: { type: String },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  username: { type: String, required: true, unique: true },
  biography: { type: String },
});

module.exports = mongoose.model("InstagramUser", InstagramUserSchema);
