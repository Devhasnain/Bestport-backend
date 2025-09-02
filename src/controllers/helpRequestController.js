const { QueueJobTypes } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { HelpRequest } = require("../schemas");
const { sendError, sendSuccess } = require("../utils");

exports.createHelpRequest = async (req, res) => {
  try {
    const user = req.user;
    const request = await HelpRequest.create({ ...req.body, user: user?._id });
    await notificationQueue.add({
      type: QueueJobTypes.HELP_REQUEST,
      data: {
        user,
        name: user?.name,
        subject: request?.subject ?? "",
        _id: request?._id ?? "",
        profile_img: user?.profile_img?.path,
      },
    });
    sendSuccess(res, "Request submitted", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getRequestById = async (req, res) => {
  try {
    if (!req.params?.id) {
      throw new Error("Param id is required.");
    }
    const request = await HelpRequest.findById(req.params.id).populate({
      path: "user",
      select: "name email profile_img _id phone position",
    });
    sendSuccess(res, "Request submitted", { request }, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getHelpRequests = async (req, res) => {
  try {
    let query = {};

    if (req.query?.userId) {
      query.user = req.query.userId;
    }

    const requests = await HelpRequest.find(query).populate({
      path: "user",
      select: "name email profile_img _id phone position",
    });

    sendSuccess(res, "Request submitted", { requests }, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// exports.updateHelpRequest = async (req, res) => {
//   try {

//   } catch (error) {
//     return sendError(res, err.message);
//   }
// };
