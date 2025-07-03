const Show = require('../models/ShowTime.js');
const Movie = require('../models/Movie.js');


exports.createShow = async function (req, res) {
  try {
    const { movie, hall, startTime, endTime } = req.body;

    // Validate show timing
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    // Create new show
    const show = new Show({ movie, hall, startTime, endTime });
    await show.save();

    // Update movie to include this show in its showTimes array
    await Movie.findByIdAndUpdate(
      movie,
      { $push: { showTimes: show._id } }
    );

    res.status(201).json({ message: 'Show created successfully', show: {movie, hall, startTime, endTime, _id: show.id} });
  } catch (err) {
    res.status(500).json({ message: "Error in creating show", error: err.message });
  }
};


exports.getAllShows = async function (req, res) {
    try {
        const shows = await Show.find().populate('movie hall');
        res.json(shows);
    }
    catch (err) {
        res.status(500).json({ message: 'Error in fetching shows', error: err.message });
    }
};