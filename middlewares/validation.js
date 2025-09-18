const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message("Invalid URL format");
};

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateItemQuery = celebrate({
  query: Joi.object().keys({
    weather: Joi.string().valid("hot", "warm", "cold"),
  }),
});

const validateAuthHeader = celebrate({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
});

module.exports = {
  validateCreateItem,
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateItemId,
  validateItemQuery,
  validateAuthHeader,
};
