const InstagramUser = require("../models/InstaUser");
const PlatForm = require("../models/PlatForm");
const InstaPost = require("../models/InstaPosts");
const CustomError = require("../errors");
const axios = require("axios");
const InstaUser = require("../models/InstaUser");
const { StatusCodes } = require("http-status-codes");

const saveInstaUser = async (req, res) => {
  const { userId } = req.user;

  const token = await PlatForm.find({ user: userId });

  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Crendentials ");
  }

  const { accessToken, userId: facebookUserId } = token[0].instagram[0];

  const facebookPageResponse = await axios.get(
    `https://graph.facebook.com/v17.0/${facebookUserId}/accounts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const facebookPageData = facebookPageResponse.data;
  const facebookPages = facebookPageData.data;

  let instagramAccountId;

  for (const page of facebookPages) {
    const pageId = page.id;

    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${pageId}`,
      {
        params: {
          fields: "instagram_business_account",
          access_token: accessToken,
        },
      }
    );

    const instagramAccount = response.data.instagram_business_account;

    if (instagramAccount) {
      instagramAccountId = instagramAccount.id;
      break;
    }
  }
  const instaResponse = await axios.get(
    "https://graph.facebook.com/v17.0/" + instagramAccountId,
    {
      params: {
        fields:
          "biography,followers_count,follows_count,media_count,name,profile_picture_url,username,website",
        access_token: accessToken,
      },
    }
  );

  const {
    biography,
    followers_count,
    follows_count,
    media_count,
    name,
    profile_picture_url,
    username,
    id,
  } = instaResponse.data;

  await PlatForm.findOneAndUpdate(
    { user: userId, "instagram._id": token[0].instagram[0]._id },
    { $set: { "instagram.$.name": username } },
    { new: true }
  );

  const instProfileDetail = await InstagramUser.create({
    user_id: id,
    followers_count,
    follows_count,
    media_count,
    name,
    profile_picture_url,
    username,
    user: userId,
    biography: biography | "",
  });

  res.status(200).json(instProfileDetail);
};

const SaveInstaPost = async (req, res) => {
  const { userId } = req.user;
  const token = await PlatForm.find({ user: userId });

  const instaUser = await InstaUser.find({ user: userId });

  if (!token || !instaUser) {
    throw new CustomError.UnauthenticatedError("Invalid Crendentials ");
  }

  const { accessToken, userId: facebookUserId } = token[0].instagram[0];

  const InstaMedia = await axios.get(
    `https://graph.facebook.com/v17.0/${instaUser[0].user_id}/media`,
    {
      params: {
        access_token: accessToken,
      },
    }
  );

  InstaMedia.data.data.forEach(async (media) => {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${media.id}`,
      {
        params: {
          fields:
            "id,media_type,media_url,owner,timestamp,like_count,comments_count,caption,permalink",
          access_token: accessToken,
        },
      }
    );

    const instaPost = response.data;

    const instaPostJSON = JSON.stringify(instaPost);

    await InstaPost.create({ media: instaPostJSON, user: userId });
  });

  res.status(200).json({ msg: "succ" });
};

const InstaGramPost = async (req, res) => {
  const { userId } = req.user;
  const posts = await InstaPost.find({ user: userId });

  res.status(StatusCodes.OK).json(posts);
};

module.exports = {
  saveInstaUser,
  SaveInstaPost,
  InstaGramPost,
};
