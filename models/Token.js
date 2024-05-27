const moongoose = require("mongoose");

const TokenSchema = new moongoose.Schema(
  {
    user: {
      type: moongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    metaCredentials: [
      {
        accessToken: String,
        userId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = moongoose.model("Token", TokenSchema);
