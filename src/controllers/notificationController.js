const { Notification } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");

exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ recipient: req?.user?._id })
        .sort({ is_read: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Notification.countDocuments({ recipient: req?.user?._id }),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, "Notifications fetched successfully", {
      notifications,
      pagination: {
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    if (!req.query?.id) {
      throw new Error("Notification id is required.");
    }
    await Notification.findByIdAndDelete(req.query.id);
    sendSuccess(res, "Notification deleted successfully.", {});
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.setNotificationSeen = async (req, res) => {
  try {
    if (!req.query?.id) {
      throw new Error("Notification id is required.");
    }
    await Notification.findByIdAndUpdate(req.query?.id, { is_read: true });
    sendSuccess(res, "", {});
  } catch (err) {
    return sendError(res, err.message);
  }
};
