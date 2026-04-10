const { User } = require("../schemas");
const { sendSuccess, sendError } = require("../utils");

exports.updateOnlineStatus = async (req, res) => {
  try {
    const user = req.user;
    const { is_online } = req.body;
    await User.findByIdAndUpdate(user?._id, {
      is_online,
      last_heartbeat: is_online ? new Date() : null,
    });
    return sendSuccess(res, "You are online now", {id:user?._id}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};
