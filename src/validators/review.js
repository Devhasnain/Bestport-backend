const { body } = require("express-validator");

const reviewDto = [
    body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ min: 10, max: 300 })
    .withMessage("Comment must be between 10 and 300 characters"),
];

module.exports = reviewDto;
