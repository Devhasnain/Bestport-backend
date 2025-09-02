const { JobStatus } = require("../config/constants");
const { Job, Ticket } = require("../schemas");

const getJobsService = async (userId, query = {}) => {
  const filters = {
    $or: [{ customer: userId }, { assigned_to: userId }],
    ...query,
  };
  return await Job.find(filters)
    .sort({ createdAt: -1 })
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
    .select(["-updatedAt", "-__v"]);
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
  const userId = user?._id;
  const canEmployeeIntract =
    user?.role === "employee" &&
    userId &&
    !job?.assigned_to &&
    job?.assigned_candidates?.includes(userId);
  return {
    job,
    meta: {
      canCompleteJob:
        job?.status === JobStatus.inProgress &&
        job?.assigned_to?._id?.toString() === userId?.toString(),
      canReviewJob:
        job?.status === JobStatus.completed &&
        job?.customer?._id?.toString() === userId?.toString() &&
        !job.review,
      canEmployeeIntract,
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
