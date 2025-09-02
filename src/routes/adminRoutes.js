const express = require("express");
const { loginDto, createEmployeeDto } = require("../validators/auth");
const { dtoValidator } = require("../middlewares");
const { login, profile } = require("../controllers/admin/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getEmployees,
  getCustomers,
  getUserById,
  createEmployee,
  editEmployee,
  getAllEmployeesList,
} = require("../controllers/admin/userController");
const {
  getAllJobs,
  getJobById,
  createJobTicket,
  deleteJob,
} = require("../controllers/admin/jobController");
const { UsersImageUploader } = require("../config/multer");
const router = express.Router();

router.post("/login", loginDto, dtoValidator, login);

router.use(authMiddleware);
router.get("/me", profile);

router.get("/employees", getEmployees);
router.get("/employees-list", getAllEmployeesList);
router.get("/customers", getCustomers);
router.get("/user/:id", getUserById);

router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobById);
router.delete("/jobs/delete", deleteJob);

router.post("/create-job-ticket", createJobTicket);
router.post("/create-employee", UsersImageUploader, createEmployeeDto, dtoValidator, createEmployee)
router.put("/update-employee", UsersImageUploader, createEmployeeDto, dtoValidator, editEmployee)

module.exports = router;
