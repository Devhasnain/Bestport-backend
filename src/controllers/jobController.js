const { QueueJobTypes, JobStatus } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { Job, User, Product } = require("../schemas");
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

exports.completeJob = async (req, res) => {
  try {
    const jobId = req.query.id;
    if (!jobId) {
      throw new Error("Job id is required.");
    }

    const job = await Job.findById(jobId);

    if (job?.status === JobStatus.completed) {
      throw new Error("This job has already completed");
    }

    if (job?.status === JobStatus.cancelled) {
      throw new Error("This job has been cancelled");
    }

    job.status = JobStatus.completed;
    job.products = req.body.products ?? [];

    await job.save();

    const customer = await User.findById(job.customer).select(["-password"]);
    const employee = await User.findById(job.assigned_to).select(["-password"]);

    await notificationQueue.add({
      type: QueueJobTypes.JOB_COMPLETED,
      data: {
        customer,
        employee,
        jobId: job._id,
      },
    });

    sendSuccess(res, "Job has been completed", {}, 200);

    setImmediate(async () => {
      try {
        if (req?.body?.products?.length) {
          for (const item of req.body.products) {
            const product = await Product.findById(item?.product);
            if (!product) continue;

            const newQuantity = product.quantity - item.quantity;

            product.quantity = newQuantity < 0 ? 0 : newQuantity;

            await product.save();
          }
        }
      } catch (backgroundError) {
        console.error(
          "Background job completion error:",
          backgroundError.message
        );
      }
    });
  } catch (error) {
    sendError(res, error?.message);
  }
};

exports.getJobs = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if(req.query?.status){
      if(req.query?.status === "in_progress"){
      query.status = JobStatus.inProgress
      }else{
        query.status=req.query?.status
      }
    }
    const jobs = await getJobsService(user?._id, query);
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
