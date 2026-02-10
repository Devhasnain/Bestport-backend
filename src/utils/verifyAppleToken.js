const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
});

function getAppleKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function verifyAppleIdentityToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getAppleKey,
      {
        issuer: "https://appleid.apple.com",
        audience: "com.projectmanagementteams.bestport",
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}

module.exports = {
  verifyAppleIdentityToken,
};
