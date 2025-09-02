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

router.get("/noti/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params?.id);
    testPushNotification(
      user?.device?.fcm_token,
      "Test notification",
      "Testing notifications sending and receiving."
    );
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "ERROR", error });
  }
});

module.exports = router;
