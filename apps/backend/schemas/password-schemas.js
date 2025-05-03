const Joi = require("joi");

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

module.exports = {
  resetPasswordSchema,
  changePasswordSchema,
};
