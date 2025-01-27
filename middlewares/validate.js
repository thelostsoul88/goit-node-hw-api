const { dataValidator, favoriteValidator } = require("../utils/dataValidator");
const {
  userSchema,
  updateSubscription,
  validationEmail,
} = require("../utils/authValidator");
const { Types } = require("mongoose");
const bcrypt = require("bcrypt");
const errHttp = require("../utils/errHttp");
const wrapper = require("../utils/wrapper");
const User = require("../models/auth");

/** Validate Body */

const validate = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = dataValidator(req.body);

  if (!name && !email && !phone) {
    next(errHttp(400, "Missing fields"));
  }

  if (error) {
    const err = error.details[0].path[0];

    next(errHttp(400, `Missing required '${err}' field`));
  }
  next();
};

/** Validate Favorite */

const validateFavorite = async (req, res, next) => {
  const { error } = favoriteValidator(req.body);

  if (error) {
    next(errHttp(400, "Missing field favorite"));
  }

  next();
};

/** Validate ID */

const validateId = async (req, res, next) => {
  const { contactId } = req.params;

  const isValidId = Types.ObjectId.isValid(contactId);

  if (!isValidId) {
    next(errHttp(400, "Unvalid ID"));
  }

  next();
};

/** Registration validation */

const validateRegistration = async (req, res, next) => {
  const { error, value } = userSchema(req.body);

  if (error) {
    const err = error.details[0].path[0];

    next(errHttp(400, `Missing field ${err}`));
    return;
  }

  const user = await User.exists({ email: value.email });

  if (user) {
    next(errHttp(409, "Email in use"));
    return;
  }

  next();
};

/** Login validation */

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = userSchema(req.body);

  if (error) {
    const err = error.details[0].path[0];

    next(errHttp(400, `Missing field ${err}`));
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    next(errHttp(401, "Email or password is wrong"));
    return;
  }

  if (!user.verify) {
    next(errHttp(401, "Email not verified"));
    return;
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    next(errHttp(401, "Email or password is wrong"));
    return;
  }

  next();
};

/** Subscription validation */

const validateSubscription = (req, res, next) => {
  const { error } = updateSubscription(req.body);

  if (error) {
    const err = error.details[0].path[0];

    next(errHttp(400, `Missing field ${err}`));
    return;
  }

  next();
};

/** Verification validation */

const validateEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    next(errHttp(404, "User not found"));
    return;
  }

  next();
};

/** Email validation */

const validateSendAgain = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const { error } = validationEmail(req.body);

  if (error) {
    const err = error.details[0].path[0];

    next(errHttp(400, `${err} is unvalid`));
    return;
  }

  if (!user) {
    throw errHttp(404, "User not found");
  }

  if (!email) {
    next(errHttp(400, "missing required field email"));
    return;
  }

  if (user.verify) {
    throw errHttp(400, "Verification has already been passed");
  }

  next();
};

module.exports = {
  validate: wrapper(validate),
  validateFavorite: wrapper(validateFavorite),
  validateId: wrapper(validateId),
  validateRegistration: wrapper(validateRegistration),
  validateLogin: wrapper(validateLogin),
  validateSubscription: wrapper(validateSubscription),
  validateEmail: wrapper(validateEmail),
  validateSendAgain: wrapper(validateSendAgain),
};
