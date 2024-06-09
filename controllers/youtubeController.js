const { StatusCodes } = require("http-status-codes");
const Youtube = require("../models/YoutubeUser");
const axios = require("axios");

const PlatForm = require("../models/PlatForm");

const saveYoutubeToken = async (req, res) => {
  const { code, platform } = req.body;

  const params = new URLSearchParams();
  params.append(
    "client_id",
    "767357925688-m0cj63gqp1evmf0qj0e73m3oh1t629mu.apps.googleusercontent.com"
  );
  params.append("client_secret", "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");
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", "https://e080-27-34-65-96.ngrok-free.app");

  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    params
  );

  const accessToken = response.data.access_token;

  const responseUser = await axios.get(
    "https://www.googleapis.com/youtube/v3/channels",
    {
      params: {
        part: "snippet,contentDetails,statistics",
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userData = responseUser.data;
  const channelItem = userData.items[0];

  const channelData = {
    channelId: channelItem.id,
    title: channelItem.snippet.title,
    description: channelItem.snippet.description,
    customUrl: channelItem.snippet.customUrl,
    publishedAt: new Date(channelItem.snippet.publishedAt),
    thumbnails: {
      default: {
        url: channelItem.snippet.thumbnails.default.url,
        width: channelItem.snippet.thumbnails.default.width,
        height: channelItem.snippet.thumbnails.default.height,
      },
      medium: {
        url: channelItem.snippet.thumbnails.medium.url,
        width: channelItem.snippet.thumbnails.medium.width,
        height: channelItem.snippet.thumbnails.medium.height,
      },
      high: {
        url: channelItem.snippet.thumbnails.high.url,
        width: channelItem.snippet.thumbnails.high.width,
        height: channelItem.snippet.thumbnails.high.height,
      },
    },
    user: req.user.userId,
    viewCount: parseInt(channelItem.statistics.viewCount, 10),
    subscriberCount: parseInt(channelItem.statistics.subscriberCount, 10),
    hiddenSubscriberCount: channelItem.statistics.hiddenSubscriberCount,
    videoCount: parseInt(channelItem.statistics.videoCount, 10),
  };

  await Youtube.create(channelData);

  let token;
  let platformData = {
    [platform]: {
      accessToken,
      tokenId: channelItem.id,
      name: channelItem.snippet.title ? channelItem.snippet.title : "",
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
  saveYoutubeToken,
};
