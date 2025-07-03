const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController.js');
const verifyToken = require('../middleware/verifyToken.js');
const authorizedRole = require('../middleware/authorizedRole.js');
const validate = require('../middleware/validateRequest')
const {createMovieSchema} = require('../validations/movieValidation.js');

router.post('/add', verifyToken, authorizedRole("admin"), movieController.addMovie);

router.get('/all', movieController.getAllMovies);

router.post('/create', validate(createMovieSchema), verifyToken, authorizedRole('admin'), movieController.createMovie);

router.get('/search', movieController.searchMovies);

module.exports = router;