const { Router } = require("express");
const {
  register,
  login,
  profile,
  setFcm,
  getFcm,
} = require("../controllers/authController");
const { registerDto, loginDto } = require("../validators/auth");
const { dtoValidator } = require("../middlewares");
const authMiddleware = require("../middlewares/authMiddleware");
const router = Router();

router.post("/register", registerDto, dtoValidator, register);
router.post("/login", loginDto, dtoValidator, login);
router.get("/me", authMiddleware, profile);
router.put("/set-fcm/:fcm", authMiddleware, setFcm);
router.get("/fcm", authMiddleware, getFcm);

module.exports = router;
