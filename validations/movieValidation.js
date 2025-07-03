const Joi = require('joi');

exports.createMovieSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(5).required(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().min(1).required(),
    genre: Joi.string().required(),
    language: Joi.string().required(),
    hall: Joi.string().length(24).required()
});
