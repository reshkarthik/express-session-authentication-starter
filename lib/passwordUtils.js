var cj = require("crypto-js");
require('dotenv').config();

const secret = process.env.SECRET;
function genPassword(password) {
  var hash = cj.AES.encrypt(password, secret).toString();
  return hash;
}

function validPassword(password, hash, modCheck = false) {
  var verify = cj.AES.decrypt(hash, secret).toString(cj.enc.Utf8);
  if (modCheck) {
    try {
      if (cj.AES.decrypt(hash, secret).toString(cj.enc.Utf8) === "") {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  }
  return password === verify;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;