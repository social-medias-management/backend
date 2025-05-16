const axios = require("axios");
const path = require("path");

const PlatForm = require("../models/PlatForm");
const PostShedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");
const fs = require("fs");
const { google } = require("googleapis");

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
        if (platform.youtube.length > 0) {
          const youtubeToken = platform.youtube[0].accessToken;
          const youtubeId = platform.youtube[0].tokenId;
          userDetail.push({
            key: "youtube",
            token: youtubeToken,
            socialId: youtubeId,
            userId: id,
          });
        }
      }
    });
  });

  for (const posts of shedulePosts) {
    for (const detail of userDetail) {
      if (detail.userId === posts.user.toString()) {
        if (posts.instagram.length > 0 && detail.key === "instagram") {
          const instagramPosts = JSON.parse(JSON.stringify(posts.instagram));
          const accessToken = detail.token;
          const socialId = detail.socialId;
          for (const insta of instagramPosts) {
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
              await axios.post(publishUrl);
              console.log("Photo uploaded successfully to Instagram");
            } catch (error) {
              console.log(error.message);
            }
          }

          await PostShedule.updateMany(
            { _id: posts._id },
            { $set: { isPublished: true } }
          );
        }

        if (posts.facebook.length > 0 && detail.key === "facebook") {
          const facebookPosts = JSON.parse(JSON.stringify(posts.facebook));
          const accessToken = detail.token;
          const socialId = detail.socialId;
          for (const facebook of facebookPosts) {
            const url = `https://graph.facebook.com/v20.0/${socialId}/photos`;

            const data = {
              url: facebook.mediaUrl,
              access_token: accessToken,
              message: facebook.caption,
            };

            try {
              await axios.post(url, data);
              console.log("Photo uploaded successfully to Facebook");
            } catch (error) {
              console.log(error.message);
            }
          }

          await PostShedule.updateMany(
            { _id: posts._id },
            { $set: { isPublished: true } }
          );
        }

        if (posts.youtube.length > 0 && detail.key === "youtube") {
          const youtubePosts = JSON.parse(JSON.stringify(posts.youtube));
          const accessToken = detail.token;
          const socialId = detail.socialId;

          for (const youtubePost of youtubePosts) {
            const ACCESS_TOKEN = accessToken;
            const fileUrl = youtubePost.mediaUrl;
            const filePath = path.join(__dirname, `temp_${socialId}.mp4`);
            const oAuth2Client = new google.auth.OAuth2();

            oAuth2Client.setCredentials({ access_token: ACCESS_TOKEN });

            const youtube = google.youtube({
              version: "v3",
              auth: oAuth2Client,
            });

            async function downloadVideo(url, destination) {
              const response = await axios({
                url,
                method: "GET",
                responseType: "stream",
              });

              const writer = fs.createWriteStream(destination);

              return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error = null;
                writer.on("error", (err) => {
                  error = err;
                  writer.close();
                  reject(err);
                });
                writer.on("close", () => {
                  if (!error) {
                    resolve();
                  }
                });
              });
            }

            try {
              console.log("Downloading video:", fileUrl);
              await downloadVideo(fileUrl, filePath);
              console.log("Video downloaded successfully.");

              console.log("Uploading video to YouTube...");
              const res = await youtube.videos.insert({
                resource: {
                  snippet: {
                    title: youtubePost.title || "Default Title",
                    description:
                      youtubePost.description || "Default Description",
                    tags: youtubePost.tags || ["tag1", "tag2", "tag3"],
                  },
                  status: {
                    privacyStatus: youtubePost.privacyStatus || "public",
                  },
                },
                part: "snippet,status",
                media: {
                  body: fs.createReadStream(filePath),
                },
              });

              console.log("Video uploaded successfully:", res.data);
              // Cleanup: remove the downloaded video file
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error("Error:", err);
            }
          }

          await PostShedule.updateMany(
            { _id: posts._id },
            { $set: { isPublished: true } }
          );
        }
      }
    }
  }

  console.log("Running hourly task...");
}

module.exports = {
  run: runHourlyTask,
};
