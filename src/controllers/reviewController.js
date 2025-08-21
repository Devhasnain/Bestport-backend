const { JobStatus, QueueJobTypes } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { Job, User, Review } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");

exports.createReview = async (req, res) => {
  try {
    const customer = req.user;
    const { jobId, employeeId } = req.query;

    if (!jobId || !employeeId) {
      throw new Error("Job and employee id is required.");
    }

    const job = await Job.findById(jobId);
    const employee = await User.findById(employeeId);

    if (!job || !employee) {
      throw new Error("Something went wrong");
    }

    if (job?.status !== JobStatus.completed) {
      throw new Error("Job is not completed yet!");
    }

    if(job.review){
      throw new Error("Job has already been reviewed")
    }

    const review = await Review.create({
      job: jobId,
      customer: customer?._id,
      employee: employeeId,
      ...req.body,
    });

    job.review = review._id;
    await job.save();

    const total = employee?.reviews?.length ?? 0;
    const currentAvg = employee?.rating ?? 0;

    const updatedAvg = (currentAvg * total + req.body.rating) / (total + 1);
    employee.rating = updatedAvg;

    await User.findByIdAndUpdate(employeeId, {
      $push: { reviews: review._id },
      $set: { rating: updatedAvg },
    });

    await notificationQueue.add({
      type: QueueJobTypes.JOB_REVIEW,
      data: {
        customer: customer,
        employee: employee,
        jobId: job?._id,
        jobTitle: job?.title ?? "",
      },
    });

    sendSuccess(res, "Review added successfully", review, 200);
    
  } catch (err) {
    console.log(err)
    return sendError(res, err.message);
  }
};
