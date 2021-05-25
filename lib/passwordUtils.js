var AES = require("crypto-js/aes");
require('dotenv').config();

const secret = process.env.SECRET;
function genPassword(password) {
  var hash = AES.encrypt(password, secret).toString();
  return hash;
}

function validPassword(password, hash) {
  var hashVerify = AES(password, secret);
  return hash === hashVerify;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;