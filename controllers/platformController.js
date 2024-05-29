const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");

const saveToken = async (req, res) => {
  const { accessToken, userId, platform, name } = req.body;

  let token;
  let platformData = {
    [platform]: {
      accessToken,
      tokenId: userId,
      name: name ? name : "",
    },
    user: req.user.userId,
  };
  let existingPlatform = await PlatForm.findOne({ user: req.user.userId });

  if (existingPlatform) {
    await PlatForm.updateOne({ user: req.user.userId }, platformData);
    token = existingPlatform;
  } else {
    token = await PlatForm.create(platformData);
  }

  res.status(StatusCodes.CREATED).json(token);
};

module.exports = {
  saveToken,
};

const userPlatform = async (req, res) => {
  const { userId } = req.user;

  const platform = await PlatForm.find({ user: userId });

  res.status(StatusCodes.OK).json(platform);
};

module.exports = {
  saveToken,
  userPlatform,
};
