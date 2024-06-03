const PlatForm = require("../models/PlatForm");
const PostShedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");

async function runHourlyTask() {
  const currentDate = moment();

  const userDetail = [{ key: "", token: "", socialId: "", userId: "" }];
  const usersIds = [];

  const shedulePosts = await PostShedule.find({
    start: { $lte: currentDate.toDate() },
    end: { $gte: currentDate.toDate() },
  });

  const platform = await PlatForm.find({});

  shedulePosts.forEach((item) => {
    usersIds.push(item.user.toString());
  });

  platform.forEach((platform) => {
    usersIds.forEach((id) => {
      if (id === platform.user.toString()) {
        const instaToken = platform.instagram[0].accessToken;
        const instaId = platform.instagram[0].tokenId;
        userDetail.push({
          key: "instagram",
          token: instaToken,
          socialId: instaId,
          userId: id,
        });
        const facebookToken = platform.facebook[0].accessToken;
        const facebookId = platform.facebook[0].tokenId;
        userDetail.push({
          key: "facebook",
          token: facebookToken,
          socialId: facebookId,
          userId: id,
        });
      }
    });
  });

  shedulePosts.forEach((posts) => {
    userDetail.forEach((detail) => {
      if ((detail.userId = posts.user.toString())) {
        if (posts.instagram.length > 0 && detail.key === "instagram") {
          const instagramPosts = JSON.parse(JSON.stringify(posts.instagram));
          const accessToken = detail.token;
          const socialId = detail.socialId;
          instagramPosts.forEach((insta) => {
            console.log("post insta", insta);
          });
        }
      }
    });
  });

  // console.log("user=", userDetail);
  console.log("Running hourly task...");
}
module.exports = {
  run: runHourlyTask,
};
