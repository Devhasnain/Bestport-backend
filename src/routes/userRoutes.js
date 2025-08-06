const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/profile",getUserProfile);
module.exports = router;