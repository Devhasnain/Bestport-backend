const { User, Job } = require("../../schemas");
const {
  sendSuccess,
  matchPassword,
  generateToken,
  sendError,
} = require("../../utils");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role:"admin"});
    if (!user) throw new Error("Invalid credentials");

    const match = await matchPassword(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = generateToken(user);
    return sendSuccess(
      res,
      "Logged in successfully",
      {
        token,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.profile = async (req, res) => {
  try {
    return sendSuccess(
      res,
      "",
      {
        user: req.user,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.DashboardAnalytics = async (req, res) => {
  try {
    // Get customer & job summary counts
    const customers = await User.countDocuments({ role: "customer" });
    const employees = await User.countDocuments({ role: "employee" });
    const pendingJobs = await Job.countDocuments({ status: "pending" });
    const completedJobsCount = await Job.countDocuments({ status: "completed" });
    const inprogressJobsCount = await Job.countDocuments({ status: "in-progress" });
    const cancelledJobsCount = await Job.countDocuments({ status: "cancelled" });
    const totalJobsCount = await Job.countDocuments();

    // Aggregate completed jobs by month
    const monthlyCompletedJobs = await Job.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // assumes createdAt field exists
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    // Prepare data for 12 months (fill missing months with 0)
    const completedJobs = Array(12).fill(0);
    monthlyCompletedJobs.forEach((month) => {
      completedJobs[month._id - 1] = month.count;
    });

    return sendSuccess(
      res,
      "",
      {
        customers,
        pendingJobs,
        completedJobsCount,
        inprogressJobsCount,
        completedJobs, // this will be used for chart
        employees,
        cancelledJobsCount,
        totalJobsCount
      },
      200
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};


exports.setFcm = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { fcm } = req.params;
    if (!fcm?.trim()?.length) throw new Error("Fcm token is required.");
    await User.findByIdAndUpdate(userId, { fcm_token: fcm });
    return sendSuccess(res, "", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getFcm = async (req, res) => {
  try {
    return sendSuccess(res, "", req.user.fcm_token, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};
