const express = require('express');
const router = express.Router();
const hallController = require('../controller/hallController');
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');
const validate = require('../middleware/validateRequest');
const { createHallSchema } = require('../validations/hallValidation');


router.post('/create', validate(createHallSchema), verifyToken, authorizedRole('admin'), hallController.createHall);

module.exports = router;
