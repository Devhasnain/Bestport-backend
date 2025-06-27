const {
  getAllJobsService,
  getJobService,
} = require("../../services/jobService");
const { sendSuccess, sendError } = require("../../utils");

exports.getAllJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const result = await getAllJobsService({
      status,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    sendSuccess(res, "", result, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobService(id);

    sendSuccess(res, "", job, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};
