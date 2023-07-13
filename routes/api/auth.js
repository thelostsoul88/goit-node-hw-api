const express = require("express");
const {
  validateRegistration,
  validateLogin,
  validateSubscription,
  validateEmail,
  validateSendAgain,
} = require("../../middlewares/validate");
const { authenticate } = require("../../middlewares/authenticate");
const {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  sendEmailAgain,
} = require("../../controllers/authControllers");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, current);
router.patch("/", authenticate, validateSubscription, updateSubscription);
router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", validateEmail, verifyEmail);
router.post("/verify/", validateSendAgain, sendEmailAgain);

module.exports = router;
