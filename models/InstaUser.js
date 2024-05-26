const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstagramUserSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  expire_time: { type: Date, required: true },
  following_count: { type: Number, default: 0 },
  followers_count: { type: Number, default: 0 },
  media_count: { type: Number, default: 0 },
  name: { type: String },
  profile_picture_url: { type: String },
  website: { type: String },
  username: { type: String, required: true, unique: true },
  biography: { type: String },
  token: { type: mongoose.Schema.ObjectId, ref: "Token", required: true },
});

module.exports = mongoose.model("InstagramUser", InstagramUserSchema);
