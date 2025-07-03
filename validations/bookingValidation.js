const Joi = require('joi');

exports.bookSeatsSchema = Joi.object({
  movie: Joi.string().length(24).required(),
  hall: Joi.string().length(24).required(),
  show: Joi.string().length(24).required(),
  seatType: Joi.string().valid('normal', 'premium').required(),
  numberOfSeats: Joi.number().integer().min(1).required(),
  seatsBooked: Joi.array().items(Joi.string()).min(1).required()
});

exports.cancelBookingParamsSchema = Joi.object({
    bookingId: Joi.string().length(24).required()
});
