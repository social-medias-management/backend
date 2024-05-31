const PostShedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");

const createShedule = async (req, res) => {
  const { start, end, platform, mediaType, caption, imgUrl } = req.body;

  let platformData = {
    start,
    end,
    [platform]: {
      mediaType,
      caption,
      imgUrl,
    },
    user: req.user.userId,
  };

  let existingPost = await PostShedule.findOne({
    user: req.user.userId,
    start: start,
    end: end,
    $or: [{ [platform]: { $exists: false } }, { [platform]: null }],
  });

  if (existingPost) {
    await PostShedule.updateOne({ _id: existingPost._id }, platformData);
    res.status(StatusCodes.OK).json(existingPost);
  } else {
    let newPost = await PostShedule.create(platformData);
    res.status(StatusCodes.CREATED).json(newPost);
  }
};

const getShedulePost = async (req, res) => {
  const shedulePost = await PostShedule.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json(shedulePost);
};

module.exports = {
  createShedule,
  getShedulePost,
};
