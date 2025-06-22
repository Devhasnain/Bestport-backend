const { User } = require("../../schemas");
const { sendError, sendSuccess } = require("../../utils");

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    return sendSuccess(res, "", employees, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" });
    return sendSuccess(res, "", customers, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};


exports.getUserById = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    return sendSuccess(res, "", user, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};
