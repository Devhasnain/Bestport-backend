// src/workers/cronWorker.js
const cron = require("node-cron");
const expireOfflineEmployees = require("../utils/expireOfflineEmployees");


module.exports = function startCronWorker() {
let isRunning = false;

  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.warn("[cron] Skipping — previous run still in progress");
      return;
    }
    isRunning = true;
    console.log("[cron] Running scheduled tasks...");
    try {
      await expireOfflineEmployees();
    } finally {
      isRunning = false;
    }
  });

  console.log("[worker] Cron worker started");
};
