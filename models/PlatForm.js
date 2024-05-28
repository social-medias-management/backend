const moongoose = require("mongoose");

const PlatFormSchema = new moongoose.Schema(
  {
    user: {
      type: moongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    facebook: [
      {
        accessToken: String,
        userId: String,
        name: String,
      },
    ],
    instagram: [
      {
        accessToken: String,
        userId: String,
        name: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = moongoose.model("PlatForm", PlatFormSchema);
