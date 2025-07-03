const Joi = require('joi');

exports.createShowTimeSchema = Joi.object({
  hall: Joi.string().length(24).required(), 
  movie: Joi.string().length(24).required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required()
});
