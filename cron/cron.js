// var cron = require("node-cron");
// const { mailController } = require("../controllers/mailControllers");

// const cronJobStart = () => {
//   // cron.schedule("* * * * *", () => {
//   //   console.log("running a task every minute");
//   // });
//   mailController();
// };

// ****************************
// module.exports = { cronJobStart };
// var cron = require("node-cron");
// const { mailController } = require("../controllers/mailControllers");
// let cronJob;
// const cronJobStart = () => {
//   cron.schedule(" */15 * * * * *", () => {
//     // mailController();
//     console.log("Running a task every 15 Minutes");
//   });
// };
// const cronJobStop = () => {
//   if (cronJob) {
//     cronJob.stop(); // Stop the cron job if it's running
//     console.log("Cron job stopped");
//   } else {
//     console.log("Cron job is not running");
//   }
// };

// module.exports = { cronJobStart, cronJobStop };

// cron.schedule("*/15 * * * * *", () => {
//   console.log("Running a task every 15 seconds");

// ****************************************************************
const cron = require("node-cron");
const { mailController } = require("../controllers/mailControllers");
let cronJob = null;

const cronJobStart = () => {
  if (!cronJob) {
    // Start the cron job only if it's not already running

    // 0 10 * * * --> every day at 10 am
    cronJob = cron.schedule("*/15 * * * * *", () => {
      mailController();
      console.log("Running cron job daily at 10:00 AM");
    });
    console.log("Cron job started");
  } else {
    console.log("Cron job is already running");
  }
};

const cronJobStop = () => {
  if (cronJob) {
    cronJob.stop(); // Stop the cron job if it's running
    cronJob = null; // Reset the cron job reference
    console.log("Cron job stopped");
  } else {
    console.log("Cron job is not running");
  }
};

module.exports = { cronJobStart, cronJobStop };

// Notes
// 0 represents the minute (at the beginning of the hour).
// 10 represents the hour (10:00 AM).
// */1 represents every 1 day interval.
// * for the remaining fields represents every month, every day of the month, and every day of the week.
// This cron job will run at 10:00 AM every day after 1 day interval.
