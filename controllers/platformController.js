const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");

const saveToken = async (req, res) => {
  const { accessToken, userId, platform } = req.body;

  let token;
  if (platform === "instagram") {
    token = await PlatForm.create({
      instagram: {
        accessToken,
        userId,
      },
      user: req.user.userId,
    });
  }

  res.status(StatusCodes.CREATED).json(token);
};

module.exports = {
  saveToken,
};

const userPlatform = async (req, res) => {
  const { userId } = req.user;

  const platform = await PlatForm.find({ user: userId });

  // const nonEmptyPlatforms = platform.filter(
  //   (platformData) => Array.isArray(platformData) && platformData.length > 0
  // );

  res.status(StatusCodes.OK).json(platform);
};

module.exports = {
  saveToken,
  userPlatform,
};
