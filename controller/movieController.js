const Movie = require('../models/Movie.js');
exports.addMovie = async function (req, res) {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({ message: "Movie Added Successfully", movie });
    }
    catch (err) {
        res.status(500).json({ message: "Error in Adding Movie", error: err.message });
    }
};
exports.getAllMovies = async function (req, res) {
    try {
        const movies = await Movie.find();
        res.json(movies);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch movies", error: err.message });
    }
};
exports.createMovie = async function (req, res) {
    try {
        const { title, description, releaseDate, duration, genre, language, showTimes } = req.body;
        const newMovie = new Movie({
            title, description, releaseDate, duration, genre, language, showTimes
        });
        console.log("Incoming request body:", req.body);
        await newMovie.save();
        res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    }
    catch (err) {
        res.status(500).json({ message: "Error in creating movie", error: err.message })
    }
}