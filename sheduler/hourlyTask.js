const axios = require("axios");

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
    isPublished: false,
  });

  const platform = await PlatForm.find({});

  shedulePosts.forEach((item) => {
    usersIds.push(item.user.toString());
  });

  platform.forEach((platform) => {
    usersIds.forEach((id) => {
      if (id === platform.user.toString()) {
        if (platform.instagram.length > 0) {
          const instaToken = platform.instagram[0].accessToken;
          const instaId = platform.instagram[0].tokenId;
          userDetail.push({
            key: "instagram",
            token: instaToken,
            socialId: instaId,
            userId: id,
          });
        }
        if (platform.facebook.length > 0) {
          const facebookToken = platform.facebook[0].accessToken;
          const facebookId = platform.facebook[0].tokenId;
          userDetail.push({
            key: "facebook",
            token: facebookToken,
            socialId: facebookId,
            userId: id,
          });
        }
      }
    });
  });

  shedulePosts.forEach((posts) => {
    userDetail.forEach(async (detail) => {
      if ((detail.userId = posts.user.toString())) {
        if (posts.instagram.length > 0 && detail.key === "instagram") {
          const instagramPosts = JSON.parse(JSON.stringify(posts.instagram));
          const accessToken = detail.token;
          const socialId = detail.socialId;
          instagramPosts.forEach(async (insta) => {
            const url = `https://graph.facebook.com/v20.0/${socialId}/media?`;

            const data = {
              image_url: insta.mediaUrl,
              access_token: accessToken,
              caption: insta.caption,
            };

            try {
              const res = await axios.post(url, data);

              const publishId = res.data;

              const publishUrl = `https://graph.facebook.com/v20.0/${socialId}/media_publish?access_token=${accessToken}&creation_id=${publishId.id}`;
              axios
                .post(publishUrl)
                .then((res) =>
                  console.log("photo uploaded successfulyy instagram")
                );
            } catch (error) {
              console.log(error.message);
            }
          });

          // await PostShedule.updateMany(
          //   { userId: detail.userId },
          //   { $set: { isPublished: true } }
          // );
        }

        if (posts.facebook.length > 0 && detail.key === "facebook") {
          const facebookPosts = JSON.parse(JSON.stringify(posts.facebook));
          const accessToken = detail.token;
          const socialId = detail.socialId;
          facebookPosts.forEach((facebook) => {
            const url = `https://graph.facebook.com/v20.0/${socialId}/photos`;

            const data = {
              url: facebook.mediaUrl,
              access_token: accessToken,
              message: facebook.caption,
            };

            try {
              axios
                .post(url, data)
                .then((res) =>
                  console.log("photo uploaded successfulyy facebook")
                );
            } catch (error) {
              console.log(error.message);
            }
          });

          // await PostShedule.updateMany(
          //   { userId: detail.userId },
          //   { $set: { isPublished: true } }
          // );
        }
      }
    });
  });

  console.log("Running hourly task...");
}
module.exports = {
  run: runHourlyTask,
};
