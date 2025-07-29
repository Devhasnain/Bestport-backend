const router = require("express").Router();
const { checkAccessKey } = require("../middlewares");
const { User } = require("../schemas");
const { sendPushNotification } = require("../utils/sendPushNotification");
const adminRoutes = require("./adminRoutes");
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const jobTicketRoutes = require("./jobTicket");
const notificationRoutes = require("./notificationRoutes");

router.use(checkAccessKey);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/job", jobRoutes);
router.use("/ticket", jobTicketRoutes);
router.use("/notification", notificationRoutes);

router.get("/noti/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params?.id);
    sendPushNotification(
      user?.fcm_token,
      "Test notification",
      "Testing notifications sending and receiving.",
      {
        url: "/user/684e3caf04ab09f12e8a52f5",
      }
    );
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "ERROR", error });
  }
});

module.exports = router;
