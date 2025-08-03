const { getNotifications, setNotificationSeen, deleteNotification } = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/",getNotifications);
router.delete("/delete",deleteNotification);
router.put("/seen",setNotificationSeen);

module.exports = router;