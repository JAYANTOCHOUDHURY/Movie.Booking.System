const Joi = require('joi');

exports.createHallSchema = Joi.object({
    name: Joi.string().min(2).required(),
    theater: Joi.string().length(24).required(), // MongoDB ObjectId
    totalSeats: Joi.number().min(1).required(),
    seatTypes: Joi.object({
        premium: Joi.number().min(0).required(),
        normal: Joi.number().min(0).required()
    }).required(),
    seatMap: Joi.array().items(
        Joi.object({
            seatNumber: Joi.string().required(),
            seatType: Joi.string().valid('premium', 'normal').required()
        })
    ).required()
});