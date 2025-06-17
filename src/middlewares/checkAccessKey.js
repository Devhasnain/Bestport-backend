require("dotenv").config();
const checkAccessKey = (req, res, next) => {
  const clientKey = req.headers['access-key'];
  const serverKey = process.env.ACCESS_KEY; // set this in your .env

  if (!clientKey) {
    return res.status(401).json({ message: 'Access key is missing in headers.' });
  }

  if (clientKey !== serverKey) {
    return res.status(403).json({ message: 'Invalid access key.' });
  }

  next();
};

module.exports = checkAccessKey;
