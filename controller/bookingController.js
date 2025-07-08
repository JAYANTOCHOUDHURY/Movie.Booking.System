
const Booking = require('../models/Booking.js');
const User = require('../models/User.js');
const Hall = require('../models/Hall.js');
const Show = require('../models/ShowTime.js');
const Movie = require('../models/Movie.js');
const sendEmail = require('../services/sendEmail.js');
const generateTicketPDF = require('../services/generatePdfTicket.js');
const path = require('path');


exports.viewTheaters = (req, res) => {
  res.json({ message: 'List of theaters will come here' });
};

exports.bookTicket = (req, res) => {
  res.json({ message: "Ticket Booked Successfully" });
};

exports.getAllBookings = async (req, res) => {
  try {
    const { date, showId } = req.query;
    const query = {};

    // Optional filter by date
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const start = new Date(parsedDate.setHours(0, 0, 0, 0));
      const end = new Date(parsedDate.setHours(23, 59, 59, 999));
      query.bookingDate = { $gte: start, $lt: end };
    }

    // Optional filter by showId
    if (showId) {
      query.show = showId;
    }

    const bookings = await Booking.find(query).populate('user movie show').populate({ path: 'hall', select: '-seatMap' });

    res.json({
      message: 'All bookings fetched successfully',
      bookings
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch all bookings',
      error: err.message
    });
  }
};


exports.getBookingForTheater = async (req, res) => {
  try {
    const theaterAdminId = req.user.userId;
    const { date, showId } = req.query;
    //Step 1 - Get hall managed by this theater admin 
    const halls = await Hall.find({ theater: { $exists: true }, createdBy: theaterAdminId });

    const hallIds = halls.map(hall => hall._id);

    const query = { hall: { $in: hallIds } };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.bookingDate = { $gte: start, $lt: end };
    }
    if (showId) {
      query.show = showId;
    }
    //Step 2 - Get booking details for all the halls 
    const bookings = await Booking.find(query).populate('user movie show').populate({ path: 'hall', select: '-seatMap' });
    res.json(bookings);
  }
  catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings for your theater', error: err.message });
  }
};

//Get all bookings made by logged-in users
exports.getMyBookings = async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user);

    const userId = req.user._id || req.user.id || req.user.userId;
    const { type, startDate, endDate, showId } = req.query;

    const query = { user: userId };

    // Optional showId filter
    if (showId) {
      query.show = showId;
    }

    // Optional date range filter on bookingDate
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) query.bookingDate.$lte = new Date(endDate);
    }

    // Fetch bookings
    let bookings = await Booking.find(query)
      .populate('movie')
      .populate({
        path: 'hall',
        select: '-seatMap'
      })
      .populate('show');

    // Filter by booking time: past or upcoming
    if (type === 'past') {
      bookings = bookings.filter(b => new Date(b.show.endTime) < new Date());
    } else if (type === 'upcoming') {
      bookings = bookings.filter(b => new Date(b.show.startTime) > new Date());
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: err.message });
  }
};



exports.bookSeats = async function (req, res) {
  try {
    // ✅ Allow only regular users to book
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only regular users can book seats.' });
    }

    // ✅ Extract request data
    const { show, seatType, numberOfSeats, seatsBooked } = req.body;

    // ✅ Validate show
    const showDoc = await Show.findById(show).populate('movie hall');
    if (!showDoc) {
      return res.status(404).json({ message: "Show not found" });
    }

    const hallDoc = await Hall.findById(showDoc.hall._id).populate('theater');

    const userDoc = await User.findById(req.user.userId);

    // ✅ Pricing map
    const prices = {
      normal: 150,
      premium: 200
    };
    if (!prices[seatType]) {
      return res.status(400).json({ message: "Invalid seat type." });
    }

    // ✅ Check for already booked seats of same type for same show
    const alreadyBooked = await Booking.aggregate([
      { $match: { show: showDoc._id, seatType } },
      { $group: { _id: null, total: { $sum: '$numberOfSeats' } } }
    ]);
    const bookedCount = alreadyBooked.length > 0 ? alreadyBooked[0].total : 0;
    const availableSeats = hallDoc.seatTypes[seatType] - bookedCount;

    if (numberOfSeats > availableSeats) {
      return res.status(400).json({ message: `Only ${availableSeats} ${seatType} seats available.` });
    }

    // ✅ Optional: Validate that selected seats are not already booked
    const existingBookings = await Booking.find({ show: showDoc._id });
    const alreadyBookedSeats = new Set();
    existingBookings.forEach(b => {
      if (Array.isArray(b.seatsBooked)) {
        b.seatsBooked.forEach(seat => alreadyBookedSeats.add(seat));
      }
    });

    const duplicateSeats = seatsBooked.filter(seat => alreadyBookedSeats.has(seat));
    if (duplicateSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${duplicateSeats.join(', ')} are already booked. Please choose different seats.`
      });
    }

    // ✅ Calculate price
    const totalPrice = prices[seatType] * numberOfSeats;

    // ✅ Create and save booking
    const booking = new Booking({
      user: req.user.userId,
      movie: showDoc.movie._id,
      hall: hallDoc._id,
      show: showDoc._id,
      seatType,
      numberOfSeats,
      totalPrice,
      seatsBooked
    });
    //Saves  booking in Database
    await booking.save();

    const movieDoc = showDoc.movie;
    const theaterDoc = hallDoc.theater;

    const userEmail = userDoc.email;
    const subject = 'Booking Confirmed!';
    const message = `
    Hello ${userDoc.name},

    Your booking for ${movieDoc.title} has been confirmed!
    Movie: ${movieDoc.title}
    Theater: ${theaterDoc.name}
    Hall: ${hallDoc.name}
    Date: ${new Date(showDoc.startTime).toDateString()}
    Time: ${new Date(showDoc.startTime).toLocaleTimeString()}
    Seat: ${seatsBooked.join(', ')}
    Total Price: ₹${totalPrice}

    Thank you for booking with us!
    Enjoy your show!
    `;

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
    <h2 style="color: #4CAF50;">Booking Confirmation</h2>
    <p>Hello <strong>${userDoc.name}</strong>,</p>

    <p>Thank you for booking with us! Here are your booking details:</p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr><td><strong> Movie:</strong></td><td>${movieDoc.title}</td></tr>
      <tr><td><strong> Theater:</strong></td><td>${theaterDoc.name}</td></tr>
      <tr><td><strong> Hall:</strong></td><td>${hallDoc.name}</td></tr>
      <tr><td><strong> Date:</strong></td><td>${new Date(booking.bookingDate).toDateString()}</td></tr>
      <tr><td><strong> Booking Time:</strong></td><td>${new Date(booking.bookingDate).toLocaleTimeString()}</td></tr>
      <tr><td><strong> Movie Time:</strong></td><td>${new Date(showDoc.startTime).toLocaleTimeString()}</td></tr>
      <tr><td><strong> Seats:</strong></td><td>${seatsBooked.join(', ')}</td></tr>
      <tr><td><strong> Total Price:</strong></td><td>₹${totalPrice}</td></tr>
    </table>

    <p style="margin-top: 20px;">Enjoy your show!</p>
    <p style="font-size: 0.9em; color: gray;">Movie Booking System</p>
  </div>
  `;
    const pdfPath = await generateTicketPDF(booking, userDoc, showDoc, movieDoc, hallDoc, theaterDoc);
    await sendEmail(userEmail, subject, message, htmlMessage, userEmail, 'Your Movie Ticket', 'Please find your attached movie ticket.', pdfPath);

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};


exports.cancelBooking = async function (req, res) {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId;

    //Find Booking by ID
    const booking = await Booking.findById(bookingId);

    //If booking not found
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    //Checks if the booking belongs to the logged-in user
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized. You can only cancel your own bookings.' });
    }

    //Update the seat after booking Deleted 
    const hall = await Hall.findById(booking.hall);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found. ' });
    }

    //Save the Updated Hall 
    await hall.save();

    //Delete the bookings 
    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: 'Booking  cancelled successfully' });
  }
  catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};

exports.getSeatMap = async (req, res) => {
  try {
    const { hallId } = req.params;
    const { showId } = req.query;

    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    // Filter bookings by hall and (optionally) show
    const filter = { hall: hallId };
    if (showId) filter.show = showId;

    const bookings = await Booking.find(filter);

    // Track booked seat numbers
    const bookedSeats = new Set();
    bookings.forEach(booking => {
      if (Array.isArray(booking.seatsBooked)) {
        booking.seatsBooked.forEach(seat => bookedSeats.add(seat));
      }
    });

    // Build seat map with status (booked / available)
    const seatMapView = hall.seatMap.map(seat => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      status: bookedSeats.has(seat.seatNumber) ? 'booked' : 'available'
    }));

    // Count booked seats by type
    let bookedNormal = 0, bookedPremium = 0;
    bookings.forEach(booking => {
      if (booking.seatType === 'normal') bookedNormal += booking.numberOfSeats;
      if (booking.seatType === 'premium') bookedPremium += booking.numberOfSeats;
    });

    // Final response
    const response = {
      hall: hall.name,
      totalSeats: hall.totalSeats,
      seatTypes: {
        normal: {
          total: hall.seatTypes.normal,
          booked: bookedNormal,
          available: hall.seatTypes.normal - bookedNormal
        },
        premium: {
          total: hall.seatTypes.premium,
          booked: bookedPremium,
          available: hall.seatTypes.premium - bookedPremium
        }
      },
      seatMap: seatMapView
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch seat map', error: err.message });
  }
};



