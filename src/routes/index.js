const router = require("express").Router();
const pusher = require("../config/pusher");
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
router.use(checkAccessKey);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/job", jobRoutes);
router.use("/ticket", jobTicketRoutes);
router.use("/notification", notificationRoutes);
router.use("/product", productsRoutes);
router.use("/user", userRoutes);
router.use("/review", reviewRoutes);



router.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const user = req.user;

  const presenceData = {
    user_id: user._id.toString(),
    user_info: {
      name: user.name,
      role: user.role,
    },
  };

  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

module.exports = router;
