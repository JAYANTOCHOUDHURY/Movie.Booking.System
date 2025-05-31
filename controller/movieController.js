const Movie = require('../models/Movie.js');
exports.addMovie = async function(req, res){
    try{
         const movie = new Movie(req.body);
         await movie.save();
         res.status(201).json({message: "Movie Added Successfully", movie});
    }
    catch(err){
         res.status(500).json({message: "Error in Adding Movie", error: err.message});
    }
};
exports.getAllMovies = async function(req, res){
    try{
        const movies = await Movie.find();
        res.json(movies);
    }
    catch(err){
        res.status(500).json({message: "Failed to fetch movies", error: err.message});
    }
};