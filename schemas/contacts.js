const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const addUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
  subsscriptrion: Joi.string(),
  token: Joi.string(),
});

module.exports = {
  addContactSchema,
  addUserSchema,
};
