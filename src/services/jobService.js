const { JobStatus, JobTicketStatus } = require("../config/constants");
const { Job, Ticket } = require("../schemas");

const getJobsService = async (userId, query = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const filters = {
    $or: [{ customer: userId }, { assigned_to: userId }],
    ...query,
  };

  const [jobs, total] = await Promise.all([
    Job.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "customer", select: "_id name profile_img" },
        { path: "assigned_to", select: "_id name profile_img" },
        {
          path: "review",
          populate: {
            path: "employee",
            select: "_id name profile_img",
          },
        },
      ])
      .select(["-updatedAt", "-__v"]),

    Job.countDocuments(filters),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const createJobService = async (data) => {
  return await (
    await Job.create(data)
  ).populate({
    path: "customer",
    select: ["_id", "name", "profile_img"],
  });
};

const getJobService = async (jobid, user) => {
  const job = await Job.findById(jobid)
    .populate([
      { path: "customer", select: "_id name profile_img email" },
      { path: "assigned_to", select: "_id name profile_img position" },
      {
        path: "review",
        populate: {
          path: "employee",
          select: "_id name profile_img",
        },
      },
      { path: "products.product", select: "_id title description price image" },
    ])
    .select(["-updatedAt", "-__v"]);

  if (!job) throw new Error("Job not found");

  const userId = user?._id?.toString();
  const isEmployee = user?.role === "employee";
  const isCustomer = user?.role === "customer";
  const isAssignedEmployee = job?.assigned_to?._id?.toString() === userId;

  // --- Ticket (sirf employee ke liye fetch karo) ---
  let ticket = null;
  let canEmployeeInteract = false;

  if (isEmployee) {
    ticket = await Ticket.findOne({
      user: user._id,
      job: job._id,
    })
      .sort({ createdAt: -1 })   // latest ticket lo
      .select("-__v -updatedAt")
      .lean();

    const ticketExpired =
      ticket && (Date.now() - new Date(ticket.createdAt).getTime()) > 15 * 60 * 1000;

    canEmployeeInteract =
      !!ticket &&
      ticket.status === JobTicketStatus.assigned &&
      !ticketExpired;
  }

  return {
    job,
    ticket: canEmployeeInteract ? ticket : null,
    meta: {
      canCompleteJob:
        isEmployee &&
        isAssignedEmployee &&
        job?.status === JobStatus.inProgress,

      canReviewJob:
        isCustomer &&
        job?.status === JobStatus.completed &&
        job?.customer?._id?.toString() === userId &&
        !job.review,

      canEmployeeInteract,
    },
  };
};

const getAllJobsService = async ({ status, page, limit, skip }) => {
  const filter = {};
  if (status) filter.status = status;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: "customer", select: "_id name profile_img" },
        { path: "assigned_to", select: "_id name profile_img" },
        {
          path: "review",
          populate: {
            path: "employee",
            select: "_id name profile_img",
          },
        },
      ])
      .select(["-updatedAt", "-__v"]),
    Job.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(total / limit);
  return {
    jobs,
    pagination: {
      total,
      page,
      totalPages,
      limit,
    },
  };
};

const createTicketService = async ({ user, job, instructions }) => {
  return (await Ticket.create({ user, job, instructions })).populate({
    path: "user",
    select: ["_id", "name", "profile_img"],
  });
};

module.exports = {
  getJobsService,
  createJobService,
  getJobService,
  getAllJobsService,
  createJobService,
  createTicketService,
};
