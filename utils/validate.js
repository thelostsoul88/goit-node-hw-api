const { dataValidator, favoriteValidator } = require("./dataValidator");
const { Types } = require("mongoose");
const errHttp = require("./errHttp");

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

const favoriteValidate = async (req, res, next) => {
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

module.exports = { validate, favoriteValidate, validateId };
