const { body } = require("express-validator");

const createJobDto = [
  body("service_type")
    .trim()
    .notEmpty()
    .withMessage("Service type is required"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("preferred_date")
    .notEmpty()
    .withMessage("Preferred date is required")
    .isISO8601()
    .withMessage("Preferred date must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error("Preferred date is invalid");
      }
      const now = new Date();
      if (date <= now) {
        throw new Error("Preferred date must be in the future");
      }
      return true;
    }),

  body("urgency")
    .trim()
    .notEmpty()
    .withMessage("Urgency is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Urgency must be one of: Low, Medium, High"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("post_code")
    .trim()
    .notEmpty()
    .withMessage("Post code is required")
    .isPostalCode("any")
    .withMessage("Post code must be valid"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),

  body("instructions")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Instructions must be at most 500 characters"),
];

module.exports = {
  createJobDto,
};
