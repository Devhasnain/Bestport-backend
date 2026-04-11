const { Router } = require("express");
const { updateOnlineStatus, updateHeartBeat } = require("../controllers/onlineStatusController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = Router();
router.put("/update", authMiddleware, updateOnlineStatus);
router.put("/update-heartbeat", authMiddleware, updateHeartBeat);


module.exports = router;