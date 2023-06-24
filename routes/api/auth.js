const express = require("express");
const {
  validateRegistration,
  validateLogin,
  validateSubscription,
} = require("../../middlewares/validate");
const { authenticate } = require("../../middlewares/authenticate");
const {
  register,
  login,
  logout,
  current,
  updateSubscription,
} = require("../../controllers/authControllers");

const router = express.Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/logout", authenticate, logout);
router.get("/current", authenticate, current);
router.patch("/", authenticate, validateSubscription, updateSubscription);

module.exports = router;
