const { QueueJobTypes } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { Job } = require("../schemas");
const {
  getJobsService,
  createJobService,
  getJobService,
} = require("../services/jobService");
const { sendError, sendSuccess } = require("../utils");
const {
  sendAdminPushNotification,
  sendPushNotification,
} = require("../utils/sendPushNotification");

exports.createJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await createJobService({ ...req.body, customer: user._id });
    sendSuccess(res, "Job has been submitted successfully.", job, 200);

    await notificationQueue.add({
      type: QueueJobTypes.NEW_JOB,
      data: {
        user,
        jobId: job?._id,
      },
    });
  } catch (err) {
    return sendError(res, err.message);
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
