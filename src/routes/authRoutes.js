const { Router } = require("express");
const {
  register,
  login,
  profile,
  setFcm,
  getFcm,
  googleLogin,
  editProfile,
  updatePassword,
  sendEmailOtp,
  verifyEmailOtp,
  setNewPassword,
} = require("../controllers/authController");
const {
  registerDto,
  loginDto,
  googleAuthDto,
  editEmailDto,
  editNameDto,
  editPasswordDto,
  sendOtpEmailDtp,
  verifyEmailOtpDto,
  setNewPasswordDto,
} = require("../validators/auth");
const { dtoValidator } = require("../middlewares");
const authMiddleware = require("../middlewares/authMiddleware");
const router = Router();

router.post("/register", registerDto, dtoValidator, register);
router.post("/login", loginDto, dtoValidator, login);
router.post("/google-auth", googleAuthDto, dtoValidator, googleLogin);
router.get("/me", authMiddleware, profile);
router.put("/edit-name", authMiddleware, editNameDto, dtoValidator, editProfile);
router.put("/edit-email", authMiddleware, editEmailDto, dtoValidator, editProfile);
router.put(
  "/edit-password",
  authMiddleware,
  editPasswordDto,
  dtoValidator,
  updatePassword
);
router.put("/set-fcm/:fcm", authMiddleware, setFcm);
router.get("/fcm", authMiddleware, getFcm);

router.post("/send-otp",  sendOtpEmailDtp, dtoValidator, sendEmailOtp);
router.post("/verify-otp",  verifyEmailOtpDto, dtoValidator, verifyEmailOtp);
router.post("/set-new-password",  setNewPasswordDto, dtoValidator, setNewPassword);


module.exports = router;
