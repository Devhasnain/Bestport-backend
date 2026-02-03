const crypto = require("crypto");
const { ApiKey } = require("../schemas");

const generateApiKey = async (name,adminId) => {
  const key = `sk_live_${crypto.randomBytes(32).toString("hex")}`;

  let apiKey = await ApiKey.create({
    created_by:adminId,
    name,
    key
  });
  return apiKey;
};

module.exports = generateApiKey