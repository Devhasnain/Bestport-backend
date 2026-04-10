const dbConnection = require("../config/db");
const startNotificationWorker = require("./notificationWorker");
const startCornWorker = require("./cornWorker");
dbConnection().then(() => {
  startNotificationWorker();
  startCornWorker();
  console.log("[workers] All workers running");
});;