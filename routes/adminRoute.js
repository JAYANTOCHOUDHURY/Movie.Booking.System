const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');
const adminController = require('../controller/adminController');


router.get('/all-users', verifyToken, authorizedRole('admin'), adminController.getAllUsers);
router.post('/add-movie', verifyToken, authorizedRole('admin'), adminController.addMovie);
router.get('/all-bookings', verifyToken, authorizedRole('admin'), adminController.viewAllBookings);

module.exports = router;
