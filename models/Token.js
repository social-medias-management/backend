const moongoose = require("mongoose");

const TokenSchema = new moongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: moongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    metaToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = moongoose.model("Token", TokenSchema);
