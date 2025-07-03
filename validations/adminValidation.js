const Joi = require('joi');

const addMovieSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    releaseDate: Joi.date().required(),
    duration: Joi.number().integer().min(30).required(),
    genre: Joi.string().required(),
    language: Joi.string().required()
});

module.exports = { addMovieSchema };
