const Joi = require('joi');

exports.createTheaterSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  location: Joi.string().min(2).max(150).required(),
  owner: Joi.string().length(24).optional()
});
