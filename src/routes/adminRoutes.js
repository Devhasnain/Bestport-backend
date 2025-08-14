const express = require("express");
const { loginDto } = require("../validators/auth");
const { dtoValidator } = require("../middlewares");
const { login, profile } = require("../controllers/admin/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getEmployees,
  getCustomers,
  getUserById,
} = require("../controllers/admin/userController");
const {
  getAllJobs,
  getJobById,
  createJobTicket,
  deleteJob,
} = require("../controllers/admin/jobController");
const router = express.Router();

router.post("/login", loginDto, dtoValidator, login);
router.get("/me", authMiddleware, profile);

router.get("/employees", authMiddleware, getEmployees);
router.get("/customers", authMiddleware, getCustomers);
router.get("/user/:id", authMiddleware, getUserById);

router.get("/jobs", authMiddleware, getAllJobs);
router.get("/jobs/:id", authMiddleware, getJobById);
router.delete("/jobs/delete", authMiddleware, deleteJob);

router.post("/create-job-ticket", authMiddleware, createJobTicket);
router.post("/create-employee",authMiddleware, dtoValidator, dtoValidator)

module.exports = router;
