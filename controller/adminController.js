//Importing Mongoose models to use in Controller 
const User = require('../models/User');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

//Getting List of all registered users - Admin
exports.getAllUsers = async (req, res) => {
  const users = await User.find(); // find all users
  res.json(users); //send as a JSON res
};

//Admin can add New Movies 
exports.addMovie = async (req, res) => {
  const { title, description, duration } = req.body; // we need to give these mendatory fie;ds
  const movie = await Movie.create({ title, description, duration }); // it takes time to create and save in database 
  res.status(201).json({ message: 'Movie added', movie }); // res success when movie added 
};

//Admin can view all tickets booking - Only booked by users
exports.viewAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('user movie');
  //This sends the bookings as a response 
  res.json(bookings);
};
