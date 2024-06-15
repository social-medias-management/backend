const axios = require("axios");
const FacebookPage = require("../models/FacebookPage");
const FacebookPost = require("../models/facebookPost");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");

const saveFacebookPageDetail = async (req, res) => {
  const { userId } = req.user;
  const token = await PlatForm.findOne({ user: userId });

  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const { accessToken, tokenId } = token.facebook[0];
  const url = `https://graph.facebook.com/${tokenId}?fields=about,attire,bio,location,parking,hours,emails,website,picture,name,followers_count,fan_count&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const pageData = response.data;

    const newPage = new FacebookPage({
      about: pageData.about,
      attire: pageData.attire,
      bio: pageData.bio,
      location: pageData.location,
      parking: pageData.parking,
      hours: pageData.hours,
      user: userId,
      emails: JSON.stringify(pageData.emails),
      website: pageData.website,
      picture: pageData.picture.data.url,
      name: pageData.name,
      followers_count: pageData.followers_count,
      fan_count: pageData.fan_count,
    });

    await newPage.save();

    res.status(StatusCodes.CREATED).json({ page: newPage });
  } catch (error) {
    console.error(error);
    throw new CustomError.BadRequestError(
      "Failed to fetch or save Facebook page details"
    );
  }
};

const saveFacebookPost = async (req, res) => {
  const { userId } = req.user;
  const token = await PlatForm.findOne({ user: userId });

  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const { accessToken, tokenId } = token.facebook[0];

  const url = `https://graph.facebook.com/v20.0/${tokenId}/feed?fields=message,attachments&access_token=${accessToken}`;
  const response = await axios.get(url);
  const pageData = response.data;

  for (const page of pageData.data) {
    await FacebookPost.create({ user: userId, media: JSON.stringify(page) });
  }

  res.status(200).json({ msg: "ok" });
};

const getFacebookPost = async (req, res) => {
  const { userId } = req.user;
  const token = await PlatForm.findOne({ user: userId });

  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const data = await FacebookPost.find({ user: userId });

  res.status(200).json(data);
};

const deleteFacebookUser = async (req, res) => {
  const { userId } = req.user;

  await FacebookPage.deleteMany({ user: userId });
  await FacebookPost.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: "deleted" });
};
module.exports = {
  saveFacebookPageDetail,
  saveFacebookPost,
  getFacebookPost,
  deleteFacebookUser,
};
