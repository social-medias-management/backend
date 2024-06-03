const axios = require("axios");
const facebookPage = require("../models/FacebookPage");
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
  const pageId = "106033669270099";
  const url = `https://graph.facebook.com/${tokenId}?fields=about,attire,bio,location,parking,hours,emails,website,picture,name,followers_count,fan_count&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    const pageData = response.data;

    const newPage = new facebookPage({
      about: pageData.about,
      attire: pageData.attire,
      bio: pageData.bio,
      location: pageData.location,
      parking: pageData.parking,
      hours: pageData.hours,
      user: userId,
      emails: JSON.stringify(pageData.emails),
      website: pageData.website,
      picture: JSON.stringify(pageData.picture.data.url),
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

module.exports = {
  saveFacebookPageDetail,
};
