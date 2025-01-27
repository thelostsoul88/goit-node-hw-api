const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const jimp = require("jimp");
const uuid = require("uuid").v4;
const wrapper = require("../utils/wrapper");
const User = require("../models/auth");
const path = require("path");
const errHttp = require("../utils/errHttp");
const sendMail = require("../utils/sendMail");

const { SECRET_KEY } = process.env;

/** Register */

const register = async (req, res) => {
  const { password, email } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: gravatar.url(email),
    verificationToken,
  });

  await sendMail(email, verificationToken);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

/** Login */

const login = async (req, res) => {
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

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

/** Current user */

const current = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

/** Update user subscription */

const updateSubscription = async (req, res) => {
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

/** Update user Avatar */

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw errHttp(400, "Missing field upload avatar");
  }

  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;

  const avatarDir = path.join(__dirname, "../public/avatars");

  const fileName = `${_id}_${originalname}`;

  const resUpload = path.join(avatarDir, fileName);

  const img = await jimp.read(tmpUpload);

  img.autocrop().cover(250, 250).write(tmpUpload);
  await fs.rename(tmpUpload, resUpload);

  const avatarURL = path.join("avatars", fileName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

/** Check Email */

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.json({ message: "Verification successful" });
};

/** Send email again */

const sendEmailAgain = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  await sendMail(email, user.verificationToken);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  register: wrapper(register),
  login: wrapper(login),
  logout: wrapper(logout),
  current: wrapper(current),
  updateSubscription: wrapper(updateSubscription),
  updateAvatar: wrapper(updateAvatar),
  verifyEmail: wrapper(verifyEmail),
  sendEmailAgain: wrapper(sendEmailAgain),
};
