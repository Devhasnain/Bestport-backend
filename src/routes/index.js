const router = require("express").Router();
const { checkAccessKey } = require("../middlewares");
const { User } = require("../schemas");
const { testPushNotification } = require("../utils/sendPushNotification");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const jobTicketRoutes = require("./jobTicket");
const notificationRoutes = require("./notificationRoutes");
const productsRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const reviewRoutes = require("./reviewRoutes");
const helpRoutes = require("./helpRoutes");
const onlineRoutes = require("./onlineStatusRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const {
  sendTestNotification,
} = require("../controllers/notificationController");

router.use(checkAccessKey);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/job", jobRoutes);
router.use("/ticket", jobTicketRoutes);
router.use("/notification", notificationRoutes);
router.use("/product", productsRoutes);
router.use("/user", userRoutes);
router.use("/review", reviewRoutes);
router.use("/help-request", helpRoutes);
router.use("/online", onlineRoutes);
router.use("/invoice", invoiceRoutes);


router.get("/noti/:id", sendTestNotification);

module.exports = router;
