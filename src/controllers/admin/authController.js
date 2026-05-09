const { User, Job, ApiKey, Invoice } = require("../../schemas");
const {
  sendSuccess,
  matchPassword,
  generateToken,
  sendError,
} = require("../../utils");
const generateApiKey = require("../../utils/generateApiKey");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
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
    const completedJobsCount = await Job.countDocuments({
      status: "completed",
    });
    const inprogressJobsCount = await Job.countDocuments({
      status: "in-progress",
    });
    const cancelledJobsCount = await Job.countDocuments({
      status: "cancelled",
    });
    const totalJobsCount = await Job.countDocuments();
    const totalInvoicesCount = await Invoice.countDocuments();

    const invoicesTotals = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountReceived" },
          totalMaterialCost: { $sum: "$totalMaterialCost" },
          totalInvoices: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalMaterialCost: 1,
          totalInvoices: 1,

          totalProfit: {
            $subtract: ["$totalRevenue", "$totalMaterialCost"],
          },
        },
      },
    ]);

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
        $sort: { _id: 1 },
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
        totalJobsCount,
        totalInvoicesCount,
        totalRevenue: invoicesTotals[0]?.totalRevenue || 0,
        totalMaterialCost: invoicesTotals[0]?.totalMaterialCost || 0,
        totalProfit: invoicesTotals[0]?.totalProfit || 0,
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

exports.getApiKeys = async (_, res) => {
  try {
    const apiKeys = await ApiKey.find({})
      .select(["key", "name", "_id", "createdAt", "created_by"])
      .populate({
        path: "created_by",
        select: "name profile_img",
      });
    return sendSuccess(res, "", { api_keys: apiKeys }, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.createApiKey = async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;
    const apiKey = await generateApiKey(name, user._id);
    return sendSuccess(
      res,
      "",
      {
        key: apiKey.key,
        name,
        _id: apiKey._id,
        created_by: {
          name: user?.name,
          profile_img: user?.profile_img,
        },
        createdAt: apiKey.createdAt,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    await ApiKey.findByIdAndDelete(id);
    return sendSuccess(res, "Api key deleted successfully.", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};
