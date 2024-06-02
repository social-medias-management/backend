const cron = require("node-cron");
const hourlyTask = require("./hourlyTask");

function setupSchedulers() {
  cron.schedule("* * * * *", () => {
    hourlyTask.run();
  });

  cron.schedule("0 0 * * *", () => {
    dailyTask.run();
  });
}

module.exports = setupSchedulers;
