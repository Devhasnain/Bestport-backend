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

    sendPushNotification(
      user,
      `Job Submitted Successfully!`,
      `Hi ${user?.name}, your job has been submitted to the admin. An employee will be assigned shortly and will reach out to you soon.`,
      {
        "image": user?.profile_img ?? "",
        "redirect": `JobDetail_${job?._id}`,
      }
    );

    // sendAdminPushNotification(
    //   "New Job Submitted",
    //   `${user?.name} just submitted a new job on BestPort.`,
    //   {
    //     "image": user?.profile_img ?? "",
    //     "redirect": `job/${job?._id}`,
    //   }
    // );

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
