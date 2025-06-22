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
const { getAllJobs } = require("../controllers/admin/jobController");
const router = express.Router();

router.post("/login", loginDto, dtoValidator, login);
router.get("/me", authMiddleware, profile);

router.get("/employees", authMiddleware, getEmployees);
router.get("/customers", authMiddleware, getCustomers);
router.get("/user/:id", authMiddleware, getUserById);

router.get("/jobs", authMiddleware, getAllJobs);

module.exports = router;
