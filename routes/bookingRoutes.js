const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');
const validate = require('../middleware/validateRequest');
const { bookSeatsSchema } = require('../validations/bookingValidation');
const { cancelBookingParamsSchema } = require('../validations/bookingValidation');


//only user can book the ticket 
router.post('/book-Ticket', verifyToken, authorizedRole('user'), bookingController.bookTicket);

//User can view their bookings 
router.get('/mybookings', verifyToken, authorizedRole('user'), bookingController.getMyBookings);

//Both user and theaterAdmin can view theaters
router.get('/view-theaters', verifyToken, authorizedRole('user', 'theaterAdmin'), bookingController.viewTheaters);

//Only admin can view all bookings
router.get('/all-bookings', verifyToken, authorizedRole('admin'), bookingController.getAllBookings);

//Only TheaterAdmin can view bookings for their theater
router.get('/theater-bookings', verifyToken, authorizedRole('theaterAdmin', 'admin'), bookingController.getBookingForTheater);

//Route to book seats (for authenticated users)
router.post('/book', validate(bookSeatsSchema), verifyToken, authorizedRole('user'), bookingController.bookSeats);

// Cancel a booking (only user can cancel their own booking)
router.delete('/:bookingId', verifyToken, authorizedRole('user'), validate(null, cancelBookingParamsSchema), bookingController.cancelBooking);

// Get seat map of a Hall
router.get('/seat-map/:hallId', bookingController.getSeatMap);


module.exports = router;
