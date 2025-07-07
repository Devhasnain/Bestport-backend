const { User } = require("../schemas");
const { editUserService } = require("../services/userService");
const {
  sendSuccess,
  matchPassword,
  generateToken,
  sendError,
  hashPassword,
} = require("../utils");
const { sendAdminPushNotification } = require("../utils/sendPushNotification");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    sendAdminPushNotification(
      "Registeration",
      `${user?.name} created account on bestport.`
    );

    return sendSuccess(
      res,
      "User registered successfully",
      {
        token,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, profile_img } = req.body;

    const findUser = await User.findOne({ email });

    if (findUser) {
      const token = generateToken(findUser);
      return sendSuccess(
        res,
        "Logged in successfully",
        {
          token,
        },
        201
      );
    } else {
      const user = new User({
        profile_img,
        name,
        email,
        password: `new-google-user-${name}`,
      });
      await user.save();
      const token = generateToken(user);
      return sendSuccess(
        res,
        "User registered successfully",
        {
          token,
        },
        201
      );
    }
  } catch (error) {
    return sendError(res, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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

exports.editProfile = async (req, res) => {
  const data = req.body;
  const user = await editUserService(req.user?._id, data);
  try {
    return sendSuccess(
      res,
      "",
      {
        user,
      },
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const match = await matchPassword(currentPassword, user.password);
  if (!match) throw new Error("Current password not matched");

  const matchNew = await matchPassword(newPassword, user.password);
  if (!matchNew)
    throw new Error("New password must be different from current password");

  const password = await hashPassword(newPassword);

  user.password = password;
  await user.save();

  try {
    return sendSuccess(res, "", {}, 201);
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
