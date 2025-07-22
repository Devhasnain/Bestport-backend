const crypto = require('crypto');

const generateOtp = () => {
  return crypto.randomInt(10000, 100000).toString();
};

module.exports = generateOtp