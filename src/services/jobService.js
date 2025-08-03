const { Job, Ticket } = require("../schemas");

const getJobsService = async (userId) => {
  return await Job.find({
    $or: [{ customer: userId }, { assigned_to: userId }],
  })
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

const getJobService = async (jobid) => {
  return await Job.findById(jobid)
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

const getAllJobsService = async ({ status, page, limit }) => {
  const filter = {};
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

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

  return { jobs, total };
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
