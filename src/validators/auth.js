const { body } = require("express-validator");
const { User } = require("../schemas");

const passwordDto = body("password")
  .trim()
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/
  )
  .withMessage(
    "Password must include uppercase, lowercase, number, and special character"
  );

const registerDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  passwordDto,
];

const createEmployeeDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
  passwordDto,
  body("date_of_birth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
body("position")
        .trim()
        .notEmpty()
        .withMessage("Position is required")
        .isLength({ min: 10 })
        .withMessage("Position must be at least 10 characters"),
    body("about")
        .trim()
        .notEmpty()
        .withMessage("About is required")
        .isLength({ min: 10 })
        .withMessage("About must be at least 10 characters"),
  body("phone")
        .trim()
        .notEmpty()
        .withMessage("About is required")
        .isLength({ min: 10 })
        .withMessage("About must be at least 10 characters"),
];

const loginDto = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  passwordDto,
];

const googleAuthDto = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
];

const editEmailDto = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
];

const editNameDto = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
];

const editPasswordDto = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Current password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/
    )
    .withMessage(
      "Current password must include uppercase, lowercase, number, and special character"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/
    )
    .withMessage(
      "New password must include uppercase, lowercase, number, and special character"
    ),
];

const sendOtpEmailDtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("Email is not registered");
      }
      return true;
    }),
];

const verifyEmailOtpDto = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 5, max: 5 })
    .withMessage("OTP must be exactly 5 digits")
    .isNumeric()
    .withMessage("OTP must be a number"),
];

const setNewPasswordDto = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Reset password token is required")
    .isLength({ min: 18 })
    .withMessage("Invalid reset password token"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]+$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),
];

module.exports = {
  registerDto,
  loginDto,
  googleAuthDto,
  editNameDto,
  editEmailDto,
  editPasswordDto,
  sendOtpEmailDtp,
  verifyEmailOtpDto,
  setNewPasswordDto,
};
