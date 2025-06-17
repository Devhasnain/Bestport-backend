const { User } = require("../schemas");
const {
  sendSuccess,
  matchPassword,
  generateToken,
  sendError,
} = require("../utils");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
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
  } catch (err) {
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
