const {
  createJob,
  getJobs,
  getJobById,
  completeJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const dtoValidator = require("../middlewares/dtoValidator");
const { createJobDto, getJobsValidator, validateJobCompletion } = require("../validators/job");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/", getJobsValidator, dtoValidator, getJobs);
router.get("/:id", getJobById);
router.post("/create", createJobDto, dtoValidator, createJob);
router.put("/complete",validateJobCompletion, dtoValidator, completeJob);

module.exports = router;
