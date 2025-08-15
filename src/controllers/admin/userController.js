const { cloudinary } = require("../../config/multer");
const { User } = require("../../schemas");
const { sendError, sendSuccess } = require("../../utils");

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select([
      "-password",
    ]).sort({createdAt:-1});
    return sendSuccess(res, "", employees, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select([
      "-password",
    ]).sort({createdAt:-1});
    ;
    return sendSuccess(res, "", customers, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return sendSuccess(res, "", user, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.createEmployee = async (req, res) => {
  let file = req?.file;
  try {
    if (!file) {
      throw new Error("Product image is required.");
    }
    const newUser = await User.create({
      ...req.body,
      profile_img: file,
      role: "employee",
    });
    const user = await User.findById(newUser?._id).select(['-password']);
    return sendSuccess(res, "Employee created successfully", user, 201);
  } catch (err) {
    if (file && file?.filename) {
      await cloudinary.api.delete_resources([file?.filename], {
        resource_type: "image",
        type: "upload",
      });
    }

    sendError(res, err.message);
  }
};

exports.editEmployee = async (req, res) => {
  let file = req.file;

  try {
    const id = req.query.id;
    if (!id?.trim()?.length) {
      throw new Error("Employee id is required");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error("Employee not found");
    }

    // Handle profile image replacement
    if (file) {
      if (user?.profile_img?.filename) {
        await cloudinary.api.delete_resources([user.profile_img.filename], {
          resource_type: "image",
          type: "upload",
        });
      }
      user.profile_img = file;
    }

    // Update other fields from req.body
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    // Save updated user
    await user.save();

    // Remove password before sending
    const { password, ...userWithoutPassword } = user.toObject();

    sendSuccess(
      res,
      "Employee updated successfully.",
      { user: userWithoutPassword },
      200
    );

  } catch (err) {
    // Delete uploaded file from Cloudinary if an error occurs
    if (file?.filename) {
      await cloudinary.api.delete_resources([file.filename], {
        resource_type: "image",
        type: "upload",
      });
    }
    sendError(res, err.message);
  }
};

