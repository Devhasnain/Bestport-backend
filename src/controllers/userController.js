const { JobStatus } = require("../config/constants");
const { User, Job, Ticket } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");

exports.getUserProfile = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new Error("Parameter id is required");
    }

    const user = await User.findById(id)
      .select([
        "-password",
        "-device",
        "-is_available",
        "-is_active",
        "-is_locked",
        "-address",
        "-email",
      ])
      .populate({
        path: "reviews",
        select: ["rating", "comment", "createdAt", "customer"],
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "customer",
          select: ["name", "profile_img"],
        },
      });

    sendSuccess(res, "New product created successfully.", user, 200);
  } catch (error) {
    sendError(res, error.message);
  }
};

exports.getDashboardAnalytics = async (req,res)=>{
  try {
    const userId = req?.user?._id;
    const filters = {$or: [{ customer: userId }, { assigned_to: userId }]};
    const assigned = await Ticket.countDocuments({user:userId,createdAt:{$gte:new Date(Date.now() - 15 * 60 * 1000)}})
    const pending =  await Job.countDocuments({...filters,status:JobStatus.pending})
    const inProgress =  await Job.countDocuments({...filters,status:JobStatus.inProgress})
    const completed =  await Job.countDocuments({...filters,status:JobStatus.completed})
    const cancelled =  await Job.countDocuments({...filters,status:JobStatus.cancelled})

    sendSuccess(res, "New product created successfully.", {
      assigned,
      pending,
      inProgress,
      completed,
      cancelled
    }, 200);

  } catch (error) {
    sendError(res, error.message);
  }
}