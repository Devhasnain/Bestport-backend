const { body } = require("express-validator");
const mongoose = require("mongoose");

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const createJobTicketDto = [
  body("user")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid User ID"),

  body("job")
    .notEmpty()
    .withMessage("Job ID is required")
    .custom((value) => isValidObjectId(value))
    .withMessage("Invalid Job ID"),
];

module.exports = {
  createJobTicketDto,
};
