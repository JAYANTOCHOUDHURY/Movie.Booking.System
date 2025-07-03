const express = require('express');
const router = express.Router();
const showController = require('../controller/showTimeController');
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');
const validate = require('../middleware/validateRequest');
const { createShowTimeSchema } = require('../validations/showTimeValidation');

//Admin or TheaterAdmin can create show 

router.post('/create', validate(createShowTimeSchema), verifyToken, authorizedRole('admin', 'theaterAdmin'), showController.createShow);

//Public router to view all shows 

router.get('/all', showController.getAllShows);

module.exports = router;