const jwt = require("jsonwebtoken");
const { User, ApiKey } = require("../schemas");
const { sendError } = require("../utils");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const apiKey = req.header("x-api-key") || null;

  if (!authHeader && !apiKey) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  if (apiKey) {
    const findKey = await ApiKey.findOne({ key: apiKey });

    if (!findKey) {
      return res
        .status(401)
        .json({ message: "Access denied. Invalid api key." });
    } else {
      next();
    }
  }

  if (authHeader) {
    if (!authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new Error("User not found.");
      }
      req.user = user;
      next();
    } catch (err) {
      return sendError(res, err.message);
    }
  }
};

module.exports = authMiddleware;
