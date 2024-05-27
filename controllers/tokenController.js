const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");

const saveToken = async (req, res) => {
  const { accessToken, userId } = req.body;

  const token = await Token.create({
    metaCredentials: {
      accessToken,
      userId,
    },
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({});
};

module.exports = {
  saveToken,
};
