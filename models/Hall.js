const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  seatType: { type: String, enum: ['normal', 'premium'], required: true }
}, { _id: false });

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  totalSeats: { type: Number, required: true },
  seatTypes: {
    premium: { type: Number, default: 0 },
    normal: { type: Number, default: 0 }
  },
  seatMap: [seatSchema], // ✅ Important
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);
