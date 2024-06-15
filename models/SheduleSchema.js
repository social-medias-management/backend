const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SheduleSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },

  facebook: [
    {
      mediaType: String,
      caption: String,
      mediaUrl: String,
    },
  ],

  instagram: [
    {
      mediaType: String,
      caption: String,
      mediaUrl: String,
    },
  ],
  instagram: [
    {
      mediaType: String,
      caption: String,
      mediaUrl: String,
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("PostShedule", SheduleSchema);
