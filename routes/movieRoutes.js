const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController.js');
const verifyToken = require('../middleware/verifyToken.js');
const authorizedRole = require('../middleware/authorizedRole.js');

router.post('/add', verifyToken, authorizedRole("admin"), movieController.addMovie);
router.get('/all', movieController.getAllMovies);
router.post('/create', verifyToken, authorizedRole('admin'), movieController.createMovie);

module.exports = router;