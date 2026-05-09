const {
  JobStatus,
  JobTicketStatus,
  QueueJobTypes,
} = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { User, Ticket, Job } = require("../schemas");
const { sendSuccess, sendError } = require("../utils");
const {
  sendAdminPushNotification,
  sendPushNotification,
} = require("../utils/sendPushNotification");
const SocketWorker = require("../workers/socketWorker");

exports.createJobTicket = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) throw new Error("User not found");

    const job = await Job.findById(req.body.job);
    if (!job) throw new Error("Job not found");

    if (
      job?.status === JobStatus.assigned ||
      job?.status === JobStatus.inProgress
    ) {
      throw new Error("Job is already assigned and in progress");
    }

    if (
      job?.status === JobStatus.completed ||
      job?.status === JobStatus.cancelled
    ) {
      throw new Error("Job is not available, already completed or closed");
    }

    // --- 15 minute expiry check ---
    const existingTicket = await Ticket.findOne({
      user: user._id,
      job: job._id,
      status: JobTicketStatus.assigned,
    });

    if (existingTicket) {
      const now = new Date();
      const createdAt = new Date(existingTicket.createdAt);
      const diffInMinutes = (now - createdAt) / (1000 * 60);

      if (diffInMinutes > 15) {
        // 15 minute se zyada purana — delete karo or naya banao
        await Ticket.findByIdAndDelete(existingTicket._id);
      } else {
        // abhi bhi valid hai — error return karo
        const remainingSeconds = Math.ceil((15 - diffInMinutes) * 60);
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        throw new Error(
          `Job ticket already exists. Please wait ${remainingMinutes} minute(s) before reassigning.`
        );
      }
    }
    // ------------------------------

    if (!job.assigned_candidates.includes(user._id)) {
      job.assigned_candidates.push(user._id);
      await job.save();
    }

    const ticket = await (
      await Ticket.create({ user, job })
    ).populate({
      path: "user",
      select: ["name", "_id", "profile_img"],
    });

    await notificationQueue.add({
      data: {
        employee: user,
        jobId: job?._id,
      },
      type: QueueJobTypes.NEW_TICKET,
    });

    sendSuccess(res, "Job ticket created successfully", ticket, 200);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getJobTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ job: req?.params?.jobId }).populate([
      {
        path: "user",
        select: ["name", "_id", "profile_img"],
      },
      {
        path: "job",
      },
    ]);
    return sendSuccess(
      res,
      "",
      {
        tickets,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getAllJobTickets = async (req, res) => {
  try {
    const status =
      req.query.status || "assigned";

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.max(
      parseInt(req.query.limit) || 10,
      1
    );

    const skip = (page - 1) * limit;

    const query = { status };

    if (req.query.user) {
      query.user = req.query.user;
    }

    if (req.query.active === "true") {
      const fifteenMinutesAgo =
        new Date(Date.now() - 15 * 60 * 1000);

      query.createdAt = {
        $gte: fifteenMinutesAgo,
      };
    }

    const [tickets, total] =
      await Promise.all([
        Ticket.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate([
            {
              path: "user",
              select: [
                "name",
                "_id",
                "profile_img",
              ],
            },
            {
              path: "job",
            },
          ]),

        Ticket.countDocuments(query),
      ]);

    const totalPages = Math.ceil(
      total / limit
    );

    return sendSuccess(
      res,
      "",
      {
        tickets,

        pagination: {
          total,
          page,
          totalPages,
          limit,
        },
      },
      200
    );
  } catch (err) {
    console.log(err);

    return sendError(res, err.message);
  }
};

exports.deleteJobTicket = async (req, res) => {
  try {
    if (!req.params?.id) {
      throw new Error("Ticket id is required");
    }
    const ticket = await Ticket.findById(req.params.id);
    await Job.findByIdAndUpdate(ticket.job, {
      $pull: { assigned_candidates: ticket.user },
    });
    await Ticket.findByIdAndDelete(req.params.id);
    return sendSuccess(res, "Job ticket deleted successfully.", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.isTicketAvailable = async (req, res) => {
  try {
    const { job } = req.query;
    if (!job) {
      throw new Error("Job id is required");
    }
    const user = req.user;
    const ticket = await Ticket.findOne({ job, user: user?._id });
    return sendSuccess(res, "", { ticket }, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.acceptJobTicket = async (req, res) => {
  try {
    const { ticketId } = req.query;
    if (!ticketId) {
      throw new Error("Ticket id is required");
    }
    const ticket = await Ticket.findById(ticketId);

    const user = req.user;

    const job = await Job.findByIdAndUpdate(ticket.job, {
      status: "in-progress",
      assigned_to: user?._id,
    }).populate({
      path: "customer",
    });

    ticket.status = "accepted";
    await ticket.save();

    await notificationQueue.add({
      type: QueueJobTypes.JOB_STARTED,
      data: {
        customer: job?.customer,
        employee: user,
        jobId: job?._id,
      },
    });

    sendSuccess(res, "Job has started", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.rejectJobTicket = async (req, res) => {
  try {
    const { ticketId } = req.query;
    if (!ticketId) {
      throw new Error("Ticket id is required");
    }
    await Ticket.findByIdAndUpdate(ticketId, { status: "rejected" });
    sendSuccess(res, "Job ticket rejected", {}, 201);

    // sendAdminPushNotification(
    //   "Job In Progress",
    //   `${job?.customer?.name}'s job is now in progress. ${user?.name} has accepted the job ticket.`,
    //   {
    //     image: user?.profile_img,
    //     redirect: `job/${job?._id}`,
    //   }
    // );

    // sendPushNotification(
    //   job?.customer,
    //   `Your Job is Now in Progress`,
    //   `Hi ${job?.customer?.name}, your job is now in progress. ${user?.name} has been assigned and will contact you shortly.`,
    //   {
    //     image: user?.profile_img,
    //     redirect: `JobDetail_${job?._id}`,
    //   }
    // );
  } catch (err) {
    return sendError(res, err.message);
  }
};
