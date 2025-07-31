require("dotenv").config();
const Queue = require("bull");

const redisConfig = {
  host: process?.env?.REDIS_HOST || "127.0.0.1",
  port: process?.env?.REDIS_PORT || 6379,
  password: process?.env?.REDIS_PASSWORD ?? "",
};

const notificationQueue = new Queue(
  "notifications",
  process?.env?.REDIS_URL ?? { redis: redisConfig }
);

module.exports = notificationQueue;
