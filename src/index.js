const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // Security headers
const compression = require("compression"); // GZIP compression
const rateLimit = require("express-rate-limit"); // Prevent brute-force
const mongoSanitize = require("express-mongo-sanitize"); // Prevent NoSQL injection
const xssClean = require("xss-clean"); // Prevent XSS attacks
const hpp = require("hpp"); // Prevent HTTP parameter pollution
const morgan = require("morgan");
const routes = require("./routes/index");
const { sendPushNotification } = require("./utils/sendPushNotification");

const app = express();

// -------------------- Security Middlewares --------------------
app.use(helmet()); // Set secure HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.disable("x-powered-by");
app.use(morgan("dev"));
// -------------------- Performance Middlewares --------------------
app.use(compression()); // Compress all responses

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
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// -------------------- Body Parsing --------------------
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json({ limit: "30mb" }));

// -------------------- Health Check --------------------
app.get("/health", (req, res) => {
  sendPushNotification(
    "eyplkQ52TYypn_f66fztJT:APA91bE26YvIkqjcw6h8dvMi8MqdoJ17IUrM1UG3biGxi37MOju1WE_siXtkBrWhocJnG_p3b39oqmdMkNxkamq_rErIocqMqiBHgvXyFwnYkC9ei3agbdg",
    "Test notification",
    "Testing notifications sending and receiving."
  )
  res.send({ status: "OK" });
});

// -------------------- API Routes --------------------
app.use("/api/v1", routes);

module.exports = app;
