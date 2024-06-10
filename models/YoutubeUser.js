const mongoose = require("mongoose");

const youtubeChannelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  customUrl: { type: String },
  publishedAt: { type: Date },
  thumbnails: {
    default: { url: String, width: Number, height: Number },
    medium: { url: String, width: Number, height: Number },
    high: { url: String, width: Number, height: Number },
  },
  viewCount: { type: Number, default: 0 },
  subscriberCount: { type: Number, default: 0 },
  hiddenSubscriberCount: { type: Boolean, default: false },
  videoCount: { type: Number, default: 0 },
  contentDetails: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const YoutubeChannel = mongoose.model("YoutubeChannel", youtubeChannelSchema);

module.exports = YoutubeChannel;
