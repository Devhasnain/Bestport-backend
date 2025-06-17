const { validationResult } = require("express-validator");

const dtoValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      field: firstError.param,
      message: firstError.msg,
    });
  }
  next();
};

module.exports = dtoValidator;