const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String, 
    releaseDate: Date, 
    duration: Number, 
    genre: String, 
    language: String, 
    hall : {type: mongoose.Schema.Types.ObjectId, ref : 'Hall', required: true},
    showTimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }]
}, 
{timestamps: true});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;