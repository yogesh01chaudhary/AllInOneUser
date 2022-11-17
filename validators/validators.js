const Joi = require("joi");
exports.phoneSchema = Joi.object()
  .keys({
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
  })
  .required();

exports.otpSchema = Joi.object()
  .keys({
    details: Joi.string().required(),
    otp: Joi.number().max(999999).required(),
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
  })
  .required();
exports.profileSchema = Joi.object()
  .keys({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    dateOfBirth: Joi.date().less("now").required(),
    gender: Joi.string().valid("male", "female").required(),
       city: Joi.string().required(),
    pincode: Joi.number().min(100000).max(999999).required(),
  })
  .required();
exports.emailSchema = Joi.object()
  .keys({
    email: Joi.string().email().required(),
  })
  .required();
exports.verifyEmailSchema = Joi.object()
  .keys({
    id: Joi.string().hex().length(24).required(),
    otp: Joi.number().min(100000).max(999999).required(),
  })
  .required();
exports.uploadPictureSchema = Joi.object()
  .keys({
    image: Joi.string().required(),
  })
  .required();
exports.updatePictureSchema = Joi.object()
  .keys({
    image: Joi.string().required(),
    imageUrl: Joi.string().required(),
  })
  .required();

exports.refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
  user_id: Joi.string().required(),
});
