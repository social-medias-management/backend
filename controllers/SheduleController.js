const PostSchedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");

const createShedule = async (req, res) => {
  const { start, end, platform, mediaType, caption, imgUrl } = req.body;

  try {
    let platformData = {
      start,
      end,
      user: req.user.userId,
    };

    platform.forEach((plat) => {
      if (plat.facebook) {
        platformData.facebook = {
          mediaType,
          caption,
          imgUrl,
        };
      }
      if (plat.instagram) {
        platformData.instagram = {
          mediaType,
          caption,
          imgUrl,
        };
      }
    });

    let existingPost = await PostSchedule.findOne({
      user: req.user.userId,
      start: start,
      end: end,
      $or: [
        { facebook: { $exists: false } },
        { instagram: { $exists: false } },
        { facebook: null },
        { instagram: null },
      ],
    });

    if (existingPost) {
      await PostSchedule.updateOne({ _id: existingPost._id }, platformData);
      res.status(StatusCodes.OK).json(existingPost);
    } else {
      let newPost = await PostSchedule.create(platformData);
      res.status(StatusCodes.CREATED).json(newPost);
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getShedulePost = async (req, res) => {
  const shedulePost = await PostSchedule.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json(shedulePost);
};

module.exports = {
  createShedule,
  getShedulePost,
};
