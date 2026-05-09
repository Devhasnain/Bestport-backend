const { body, query } = require("express-validator");
const { JobStatus } = require("../config/constants");

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

const getJobsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("status")
    .optional()
    .isIn(Object.values({...JobStatus,all:"all"}))
    .withMessage(`Status must be one of: ${Object.values(JobStatus).join(", ")}`),
];

const validateJobCompletion = [
  body('jobId').isMongoId().withMessage('Invalid Job ID'),
  body('customerId').isMongoId().withMessage('Invalid Customer ID'),
  body('employeeId').isMongoId().withMessage('Invalid Employee ID'),
  
  body('receivedAmount')
    .isNumeric()
    .withMessage('Received amount must be a number')
    .custom((value) => value >= 0)
    .withMessage('Received amount cannot be negative'),

  body('products')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Products must be an array'),

  body('products.*.quantity')
    .if(body('products').exists())
    .isInt({ min: 1 })
    .withMessage('Selected product quantity must be at least 1'),

  body('products.*.product._id')
    .if(body('products').exists())
    .isMongoId()
    .withMessage('Invalid Product ID inside array'),

  body('products.*.product.title')
    .if(body('products').exists())
    .notEmpty()
    .withMessage('Product title is required'),

  body('products.*.product.price')
    .if(body('products').exists())
    .isNumeric()
    .withMessage('Product price must be a number'),
];

module.exports = {
  createJobDto,
  getJobsValidator,
  validateJobCompletion
};
