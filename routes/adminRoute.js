const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');
const adminController = require('../controller/adminController');
const validate = require('../middleware/validateRequest');
const { addMovieSchema } = require('../validations/adminValidation');


router.get('/all-users', verifyToken, authorizedRole('admin'), adminController.getAllUsers);

router.post('/add-movie', verifyToken, authorizedRole('admin'), validate(addMovieSchema), adminController.addMovie);

router.get('/all-bookings', verifyToken, authorizedRole('admin'), adminController.viewAllBookings);

module.exports = router;
