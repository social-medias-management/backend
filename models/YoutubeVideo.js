const mongoose = require("mongoose");

const YoutubeVideoSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  publishedAt: { type: Date },
  thumbnails: String,
  channelTitle: String,
  playlistId: String,
  resourceId: String,
  videoOwnerChannelTitle: String,
  videoOwnerChannelId: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const YoutubeVideo = mongoose.model("YoutubeVideo", YoutubeVideoSchema);

module.exports = YoutubeVideo;
