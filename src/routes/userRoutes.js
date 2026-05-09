const { getUserProfile, getDashboardAnalytics } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/profile",getUserProfile);
router.get("/dashboard-analytics",getDashboardAnalytics);
module.exports = router;