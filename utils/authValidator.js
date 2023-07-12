const Joi = require("joi");

const userSchema = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
  });

  return schema.validate(data);
};

const updateSubscription = (data) => {
  const schema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });
  return schema.validate(data);
};

const validationEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

module.exports = { userSchema, updateSubscription, validationEmail };
