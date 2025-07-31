const { User, Otp } = require("../schemas");
const { editUserService } = require("../services/userService");
const {
  sendSuccess,
  matchPassword,
  generateToken,
  sendError,
  hashPassword,
  generateOtp,
} = require("../utils");
const { sendMail } = require("../utils/sendMail");
const {
  sendAdminPushNotification,
  sendPushNotification,
} = require("../utils/sendPushNotification");
const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    sendSuccess(
      res,
      "User registered successfully",
      {
        token,
      },
      201
    );

    // sendAdminPushNotification(
    //   "New Registeration",
    //   `New user ${user?.name} just signed up on Bestport.`,
    //   {
    //     image: user?.profile_img,
    //     redirect: `user/${user?._id}`,
    //   }
    // );

    // sendPushNotification(
    //   user,
    //   `${user?.name} welcome to Bestport!`,
    //   `We're excited to have you onboard. ${user?.name} just joined BestPort — let's get started!`,
    //   {
    //     image: user?.profile_img,
    //     redirect: "CreateJob",
    //   }
    // );
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
      const user = await User.create({
        profile_img,
        name,
        email,
        password: `new-google-user-${name}`,
      });
      const token = generateToken(user);
      sendSuccess(
        res,
        "User registered successfully",
        {
          token,
        },
        201
      );

      // sendAdminPushNotification(
      //   "New Registeration",
      //   `New user ${user?.name} just signed up on Bestport.`,
      //   {
      //     image: user?.profile_img,
      //     redirect: `user/${user?._id}`,
      //   }
      // );

      // sendPushNotification(
      //   user,
      //   `${user?.name} welcome to Bestport!`,
      //   `We're excited to have you onboard. ${user?.name} just joined BestPort — let's get started!`,
      //   {
      //     image: user?.profile_img,
      //     redirect: "CreateJob",
      //   }
      // );
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

exports.registerDevice = async (req, res) => {
  try {
    const userId = req.user?._id;
    await User.findByIdAndUpdate(userId, { device: req.body });
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

exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await Otp.deleteMany({ email });

    const otp = generateOtp();
    const hashedOtp = await hashPassword(otp);

    await Otp.create({ email, otp: hashedOtp });
    await sendMail({
      email,
      subject: "Your forget password otp",
      payload: otp,
      template: "otp",
    });

    return sendSuccess(res, "Otp send successfully", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });
    if (!record) {
      throw new Error("OTP expired or invalid");
    }

    const isValid = await matchPassword(otp, record.otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }
    await Otp.deleteMany({ email });
    const user = await User.findOne({ email });
    console.log(user);
    const token = generateToken(user);

    return sendSuccess(res, "Otp verified successfully", { token }, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.setNewPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found.");
    }

    user.password = password;
    await user.save();

    return sendSuccess(res, "Password changed successfully", {}, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};
