const express = require('express');
const router = express.Router();
const hallController = require('../controller/hallController');
const verifyToken = require('../middleware/verifyToken');
const authorizedRole = require('../middleware/authorizedRole');

router.post('/create', verifyToken, authorizedRole('admin'), hallController.createHall);

module.exports = router;
