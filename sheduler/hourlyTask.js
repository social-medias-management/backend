const PostShedule = require("../models/SheduleSchema");
const { StatusCodes } = require("http-status-codes");

async function runHourlyTask() {
  const sheduleData = await PostShedule.find({});

  console.log("Running hourly task...");
  console.log(sheduleData);
}
module.exports = {
  run: runHourlyTask,
};
