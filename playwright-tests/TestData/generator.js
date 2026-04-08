const crypto = require("crypto");

function generateUniqueEmail() {
  return crypto.randomBytes(4).toString("hex") + "-" + Date.now() + "@test.com";
}

module.exports = { generateUniqueEmail };
