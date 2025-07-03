const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  hall: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall' },
  seatType: { type: String, enum: ['premium', 'normal'] },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  numberOfSeats: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  seatsBooked: [{type: String}]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
