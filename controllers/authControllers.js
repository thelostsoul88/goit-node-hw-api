const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/wrapper");
const User = require("../models/auth");

const { SECRET_KEY } = process.env;

/** Register */

const register = async (req, res, next) => {
  const { password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  const id = newUser._id;
  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "31d" });
  await User.findByIdAndUpdate(id, { token });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

/** Login */

const login = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const id = user._id;
  const token = jwt.sign({ id }, SECRET_KEY, { expiresIn: "31d" });
  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

/** Logout */

const logout = async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

/** Current user */

const current = (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

/** Update user subscription */

const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );
  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

module.exports = {
  register: wrapper(register),
  login: wrapper(login),
  logout: wrapper(logout),
  current: wrapper(current),
  updateSubscription: wrapper(updateSubscription),
};
