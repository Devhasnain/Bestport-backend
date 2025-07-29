
// Success response
const sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
const sendError = (res, message = "Something went wrong", statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { sendSuccess, sendError };
