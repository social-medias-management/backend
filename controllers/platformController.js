const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");
const InstaUser = require("../models/InstaUser");

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

const getConnectedPlatForm = async (req, res) => {
  const instaUser = await InstaUser.find({ user: req.user.userId });

  const connectUserPlatform = await PlatForm.find({
    user: req.user.userId,
    instagram: { $ne: [] },
    facebook: { $ne: [] },
    facebookPages: { $ne: [] },
  }).lean();

  connectUserPlatform.forEach((platform) => {
    platform.instagram.forEach((instagramObj) => {
      instagramObj.profile_picture_url = instaUser.profile_picture_url;
    });
  });

  res.status(StatusCodes.OK).json(connectUserPlatform);
};

module.exports = {
  saveToken,
  userPlatform,
  getConnectedPlatForm,
};
