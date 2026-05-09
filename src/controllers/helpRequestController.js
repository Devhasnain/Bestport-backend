const { QueueJobTypes } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const { HelpRequest } = require("../schemas");
const { sendError, sendSuccess, generateUniqueTicketId } = require("../utils");

exports.createHelpRequest = async (req, res) => {
  try {
    const user = req.user;
    const ticketId = await generateUniqueTicketId()
    const request = await HelpRequest.create({ ...req.body, user: user?._id,ticketId});
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
    console.log(err)
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

    // User filtering logic
    if (req.query?.userId) {
      query.user = req.query.userId;
    }

    if (req?.user) {
      query.user = req.user?._id;
    }

    // Pagination Logic
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 requests per page
    const skip = (page - 1) * limit;

    // Total documents count (Pagination metadata ke liye)
    const totalRequests = await HelpRequest.countDocuments(query);

    const requests = await HelpRequest.find(query)
      .populate({
        path: "user",
        select: "name email profile_img _id phone position",
      })
      .sort({ createdAt: -1 }) // Latest requests sabse upar
      .skip(skip)
      .limit(limit);

    // Pagination Metadata
    const pagination = {
      total: totalRequests,
      page,
      limit,
      pages: Math.ceil(totalRequests / limit),
    };

    // Response mein requests aur pagination metadata dono bhej rahe hain
    sendSuccess(res, "Requests fetched successfully", { 
      requests, 
      pagination 
    }, 200); // Listing ke liye status code 200 behtar hai

  } catch (err) {
    return sendError(res, err.message);
  }
};