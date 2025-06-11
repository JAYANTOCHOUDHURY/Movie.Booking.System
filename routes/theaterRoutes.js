const express = require('express');
const router = express.Router();
const theaterController = require('../controller/theaterController');
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');

router.post('/add', verifyToken, authorizedRole('admin'), theaterController.createTheater);

router.get('/all', verifyToken, theaterController.getAllTheaters);

//Only admin can create a Theater
router.post('/create', verifyToken, authorizedRole('admin'), theaterController.createTheater);

module.exports = router;
