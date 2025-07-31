const { QueueJobTypes } = require("../../config/constants");
const notificationQueue = require("../../queues/notificationQueue");
const { Job, Ticket, User } = require("../../schemas");
const {
  getAllJobsService,
  getJobService,
  createTicketService,
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

exports.createJobTicket = async (req, res) => {
  try {
    const { user, job } = req.params;
    const { instructions } = req.body;
    const ticket = await createTicketService({
      user,
      job,
      instructions,
    });

    const employee = await User.findById(user);

    await notificationQueue.add({
      user:employee,
      jobId:job,
      type:QueueJobTypes.NEW_TICKET
    })

    sendSuccess(res, "", ticket, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const id = req.query.id;
    if(!id){
      throw new Error("Job id is required.")
    }
    await Job.findByIdAndDelete(id);
    await Ticket.findOneAndDelete({job:id});
    sendSuccess(res, "Job deleted successfully", {}, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};
