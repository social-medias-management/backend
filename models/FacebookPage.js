const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    about: { type: String, required: false },
    attire: { type: String, required: false },
    bio: { type: String, required: false },
    location: { type: String, required: false },
    parking: { type: String, required: false },
    hours: { type: String, required: false },
    emails: { type: [String], required: false },
    website: { type: String, required: false },
    picture: { type: String, required: false },
    name: { type: String, required: false },
    followers_count: { type: Number, required: false },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    fan_count: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Page", PageSchema);
