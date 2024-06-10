const { StatusCodes } = require("http-status-codes");
const PlatForm = require("../models/PlatForm");
const YoutubeVideos = require("../models/YoutubeVideo");
const axios = require("axios");

const YoutubeVideo = async (req, res) => {
  const userId = req.user.userId;
  const token = await PlatForm.find({ user: userId });
  if (!token) {
    throw new CustomError.UnauthenticatedError("Invalid Crendentials ");
  }

  const { accessToken, tokenId } = token[0].youtube[0];

  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlistItems`,
    {
      params: {
        part: "snippet",
        playlistId: "UUmbv_HxzlZv-SLJk2epVuwg",
        maxResults: 50,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { items } = response.data;

  for (const item of items) {
    const {
      channelId,
      title,
      description,
      publishedAt,
      thumbnails,
      channelTitle,
      playlistId,
      resourceId,
      videoOwnerChannelTitle,
      videoOwnerChannelId,
    } = item.snippet;

    const video = new YoutubeVideos({
      channelId,
      title,
      description,
      publishedAt,
      thumbnails: thumbnails.default.url,
      channelTitle,
      playlistId,
      resourceId: resourceId.videoId,
      videoOwnerChannelTitle,
      videoOwnerChannelId,
      user: userId,
    });

    await video.save();
  }

  res.status(StatusCodes.CREATED).json({ msg: "ok" });
};

const getYoutubeVideo = async (req, res) => {
  const userId = req.user.userId;
  const data = await YoutubeVideos.find({ user: userId });

  res.status(StatusCodes.OK).json(data);
};

module.exports = {
  YoutubeVideo,
  getYoutubeVideo,
};
