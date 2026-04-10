const { Router } = require("express");
const { updateOnlineStatus } = require("../controllers/onlineStatusController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = Router();
router.put("/update", authMiddleware, updateOnlineStatus);

module.exports = router;