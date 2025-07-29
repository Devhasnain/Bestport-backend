const { getNotifications, setNotificationSeen } = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/",getNotifications);
router.get("/seen",setNotificationSeen);

module.exports = router;