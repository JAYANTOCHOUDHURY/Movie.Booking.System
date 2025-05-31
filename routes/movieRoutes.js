const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController.js');
const { verifyToken} = require('../middleware/verifyToken.js');
const authrorizedRole = require('../middleware/authorizedRole.js');

router.post('/add', verifyToken, authrorizedRole("admin"), movieController.addMovie);
router.get('/all', movieController.getAllMovies);

module.exports = router;