const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");
const InstaUser = require("../models/InstaUser");
const PageDetail = require("../models/FacebookPage");

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
  const facebookPageInfo = await PageDetail.find({ user: req.user.userId });

  const connectUserPlatform = await PlatForm.find({
    user: req.user.userId,
    instagram: { $ne: [] },
    facebook: { $ne: [] },
    facebookPages: { $ne: [] },
  }).lean();

  const newArr = connectUserPlatform.map((platform) => {
    const newrr = [];

    if (platform.facebook && platform.facebook.length > 0) {
      const facebookValue = {
        key: "facebook",
        tokenId: platform.facebook[0].tokenId,
        name: platform.facebook[0].name,
        id: platform.facebook[0]._id,
        profile_picture_url: facebookPageInfo[0].picture,
      };
      newrr.push(facebookValue);
    }
    if (platform.instagram && platform.instagram.length > 0) {
      const facebookValue = {
        key: "instagram",
        tokenId: platform.instagram[0].tokenId,
        name: platform.instagram[0].name,
        id: platform.instagram[0]._id,
        profile_picture_url: instaUser[0].profile_picture_url,
      };
      newrr.push(facebookValue);
    }
    if (platform.youtube && platform.youtube.length > 0) {
      const facebookValue = {
        key: "youtube",
        tokenId: platform.youtube[0].tokenId,
        name: platform.youtube[0].name,
        id: platform.youtube[0]._id,
        profile_picture_url: instaUser[0].profile_picture_url,
      };
      newrr.push(facebookValue);
    }
    return newrr;
  });

  res.status(StatusCodes.OK).json(newArr.flat());
};

module.exports = {
  saveToken,
  userPlatform,
  getConnectedPlatForm,
};
