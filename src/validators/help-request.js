const { body } = require("express-validator");

const helpRequestDto = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 5, max: 150 })
    .withMessage("Subject must be between 5 and 150 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),
];

module.exports = {
  helpRequestDto,
};
