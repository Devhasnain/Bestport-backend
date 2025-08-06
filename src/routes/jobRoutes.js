const {
  createJob,
  getJobs,
  getJobById,
  completeJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middlewares/authMiddleware");
const dtoValidator = require("../middlewares/dtoValidator");
const { createJobDto } = require("../validators/job");

const router = require("express").Router();
router.use(authMiddleware);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/create", createJobDto, dtoValidator, createJob);
router.put("/complete", completeJob);

module.exports = router;
