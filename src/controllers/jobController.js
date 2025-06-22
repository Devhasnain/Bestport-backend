const { Job } = require("../schemas");
const { getJobsService, createJobService, getJobService } = require("../services/jobService");
const { sendError, sendSuccess } = require("../utils");
const { sendAdminPushNotification } = require("../utils/sendPushNotification");

exports.createJob = async (req, res) => {
  try {
    const job = await createJobService({ ...req.body, customer: req.user._id });
    sendSuccess(res, "Job has been submitted successfully.", job, 200);
  } catch (err) {
    return sendError(res, err.message);
  } finally {
    sendAdminPushNotification('New job',`${req?.user?.name} has submitted a new job.`)
  }
};

exports.getJobs = async (req, res) => {
  try {
    const user = req.user;
    const jobs = await getJobsService(user?._id);
    sendSuccess(res, "", jobs, 200);
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
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    sendSuccess(res, "Job deleted successfully.", {}, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};
