const mongoose = require('mongoose');
const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required : true },
  totalSeats: { type: Number, required: true }, // <== Here
  seatTypes: {
    premium: { type: Number, default: 0 },
    normal: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Hall', hallSchema);
