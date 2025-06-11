
const Booking = require('../models/Booking.js');
exports.viewTheaters = (req, res) => {
  res.json({ message: 'List of theaters will come here' });
};

exports.bookTicket = (req, res) => {
  res.json({ message: "Ticket Booked Successfully" });
};

exports.getAllBookings = (req, res) => {
  res.json({ message: "All Booked fetched" });
};

exports.getBookingForTheater = (req, res) => {
  res.json({ message: "Bookings for your Theater" })
};

//Get all bookings made by logged-in users
exports.getMyBookings = async (req, res) => {
  try {
     // Find bookings where the `user` field matches the logged-in user's ID
     // `.populate()` replaces movie and hall IDs with full documents
    const bookings = await Booking.find({ user: req.user.userId }).populate('movie hall');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
};


exports.bookSeats = async function (req, res) {
  try {
    const userRole = req.user.role;
    if (userRole !== 'user') {
      return res.status(403).json({ message: 'Only regular users can book seats.' });
    }
    //Extract booking data from request body 
    const { movie, hall, seatType, numberOfSeats } = req.body;
    //Prices according to seats
    const prices = {
      normal: 150,
      premium: 200
    };
    if (!prices[seatType]) {
      return res.status(400).json({ message: "Invalid Seat Type." });
    }
    //Calculation for total Price 
    const totalPrice = prices[seatType] * numberOfSeats;
    //Create a new booking docs. with user and booking details
    const booking = new Booking({
      user: req.user.id,
      movie,
      hall,
      seatType,
      numberOfSeats,
      totalPrice
    });

      //Saves  booking in Database
    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};