const { QueueJobTypes, JobStatus } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { Job, User, Product } = require("../schemas");
const Invoice = require("../schemas/Invoice");
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
    const { jobId, customerId, employeeId, receivedAmount, products } =
      req.body;

    const job = await Job.findById(jobId);

    if (job?.status === JobStatus.completed) {
      throw new Error("This job has already completed");
    }

    if (job?.status === JobStatus.cancelled) {
      throw new Error("This job has been cancelled");
    }

    job.status = JobStatus.completed;
    job.products = products?.length
      ? products.map((item) => ({
          product: item?.product?._id,
          quantity: item?.quantity,
        }))
      : [];

    await job.save();

    await Invoice.create({
      job: jobId,
      employee: employeeId,
      customer: customerId,
      products: products?.length
        ? products?.map((item) => ({
            title: item?.product?.title,
            price: item?.product?.price,
            quantity: item?.quantity,
          }))
        : [],
      amountReceived: receivedAmount,
    });

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
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const { jobs, pagination } = await getJobsService(
      user?._id,
      query,
      Number(page),
      Number(limit)
    );
    sendSuccess(res, "", { jobs, pagination }, 200);
  } catch (err) {
    console.log(err);
    return sendError(res, err.message);
  }
};

exports.getJobById = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const job = await getJobService(id, user);
    sendSuccess(res, "", job, 200);
  } catch (err) {
    console.log(err);
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
