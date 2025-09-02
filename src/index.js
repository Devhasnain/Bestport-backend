const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // Security headers
const compression = require("compression"); // GZIP compression
const rateLimit = require("express-rate-limit"); // Prevent brute-force
// const mongoSanitize = require("express-mongo-sanitize"); // Prevent NoSQL injection
// const xssClean = require("xss-clean"); // Prevent XSS attacks
const hpp = require("hpp"); // Prevent HTTP parameter pollution
const morgan = require("morgan");
const routes = require("./routes/index");
const { sendPushNotification, testPushNotification } = require("./utils/sendPushNotification");
const notificationQueue = require("./queues/notificationQueue");
const basicAuth = require("express-basic-auth");
const { QueueJobTypes } = require("./config/constants");
const serverAdapter = require("./queues/bullBoard");
const responseTime = require("response-time");
const app = express();

app.use(
  "/admin/queues",
  basicAuth({
    users: { [process.env.BULL_BOARD_USER]: process.env.BULL_BOARD_PASS },
    challenge: true,
  })
);
// -------------------- Security Middlewares --------------------

app.use(helmet(
  {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}
)); // Set secure HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.disable("x-powered-by");
app.set('trust proxy', 1);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// -------------------- Performance Middlewares --------------------
app.use(compression());
app.set("etag", "strong");
app.use(responseTime());

// Security Parsing
// app.use(mongoSanitize({ replaceWith: "_" }));
// app.use(xssClean());

// -------------------- CORS --------------------
app.use(
  cors({
    origin: "*", // Adjust to your allowed origins in production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// -------------------- Rate Limiting --------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// -------------------- Body Parsing --------------------
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json({ limit: "30mb" }));

// -------------------- Health Check --------------------
app.get("/health", async (req, res) => {
  await notificationQueue.add({
    type: QueueJobTypes.TEST,
    data: {
      token:"dLZBMnqMQmC2FtQHs03Nw_:APA91bEldOb2JZHVfUkZ6AII1doNoF6_Om-gedWt6Buo-Dm_IAUwVuVlXiO_c2gxuWyJduDpX1s_QpI9aZwP5HygF8rb0WHGlE-5DTRDui9kgeVI-NaX47s",
      title: "Test notification",
      body: "Test push notification",
    },
  });
  res.send({ status: "OK" });
});

// -------------------- API Routes --------------------
app.use("/api/v1", routes);
app.use("/admin/queues", serverAdapter.getRouter());

module.exports = app;
