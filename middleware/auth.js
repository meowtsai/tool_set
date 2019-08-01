const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config")["jwtSecret"];

module.exports = function(req, res, next) {
  //get token
  const token = req.header("x-auth-token");
  //console.log("middle auth ", token); //{ r: 'manage_role', op: 'read' }
  if (!token) {
    return res.status(401).json({ msg: "身分驗證失敗, 請登入" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "身分驗證失敗, 請登入" });
  }
};
