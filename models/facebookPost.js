const moongoose = require("mongoose");

const FacebookPostSchema = new moongoose.Schema(
  {
    user: {
      type: moongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = moongoose.model("FacebookPost", FacebookPostSchema);
