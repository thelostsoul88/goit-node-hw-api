const jwt = require("jsonwebtoken");
const errHttp = require("../utils/errHttp");
const wrapper = require("../utils/wrapper");
const Auth = require("../models/auth");

const authenticate = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) {
    next(errHttp(401, "Not authorized"));
    return;
  }

  const { id } = jwt.verify(token, process.env.SECRET_KEY);
  const user = await Auth.findById(id);

  if (!user || !user.token) {
    next(errHttp(401, "Not authorized"));
    return;
  }

  req.user = user;
  next();
};

module.exports = { authenticate: wrapper(authenticate) };
