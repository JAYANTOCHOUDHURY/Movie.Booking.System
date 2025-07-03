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
        const { title, description, releaseDate, duration, genre, language, hall, showTimes } = req.body;
        const newMovie = new Movie({
            title, description, releaseDate, duration, genre, language, hall, showTimes
        });
        console.log("Incoming request body:", req.body);
        await newMovie.save();
        res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    }
    catch (err) {
        res.status(500).json({ message: "Error in creating movie", error: err.message })
    }
}

exports.searchMovies = async function (req, res) {
    try {
        const { genre, language, startDate, endDate, startTime, endTime } = req.query;

        let query = {};
        if (genre){
            query.genre = {$regex: new RegExp(genre, 'i')};
        }
        if (language){
            query.language = {$regex: new RegExp(language, 'i')};
        }

        // Filter by movie release date
        if (startDate || endDate) {
            query.releaseDate = {};
            if (startDate) query.releaseDate.$gte = new Date(startDate);
            if (endDate) query.releaseDate.$lte = new Date(endDate);
        }

        // Find movies + filter showTimes by show start/end time
        const movies = await Movie.find(query).populate({
            path: 'showTimes',
            select: 'startTime endTime hall',
            match: {
                ...(startTime && { startTime: { $gte: new Date(startTime) } }),
                ...(endTime && { endTime: { $lte: new Date(endTime) } })
            }
        });

        // Filter out movies that don’t match show time filters
        const filteredMovies = movies.filter(movie =>
            movie.showTimes.length > 0 || (!startTime && !endTime)
        );

        res.json(filteredMovies);
    } catch (err) {
        res.status(500).json({ message: 'Error searching movies', error: err.message });
    }
};
