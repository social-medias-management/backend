const PlatForm = require("../models/PlatForm");
const PostShedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");

async function runHourlyTask() {
  const currentDate = moment();

  const userToken = [{ key: "", value: "" }];
  const usersIds = [];

  const platformUsers = await PostShedule.find({
    start: { $lte: currentDate.toDate() },
    end: { $gte: currentDate.toDate() },
  });

  console.log(platformUsers);

  const platform = await PlatForm.find({
    user: platformUsers.user,
  });

  platformUsers.forEach((item) => {
    // usersIds.push(item.user.toString());
    usersIds.push(item.user);
  });

  const uniqueUsers = new Set(usersIds);

  console.log("user=", uniqueUsers, usersIds);
  console.log("Running hourly task...");
}
module.exports = {
  run: runHourlyTask,
};
