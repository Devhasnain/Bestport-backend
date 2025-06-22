const {
  createJob,
  getJobs,
  getJobById,
} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const dtoValidator = require("../middlewares/dtoValidator");
const { createJobDto } = require("../validators/job");

const router = require("express").Router();
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);
router.post("/create", authMiddleware, createJobDto, dtoValidator, createJob);
module.exports = router;
