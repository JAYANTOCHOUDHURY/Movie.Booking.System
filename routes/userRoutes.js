const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const validate = require('../middleware/validateRequest.js')
const {signupSchema, loginSchema} = require('../validations/userValidation')


router.post('/signup', validate(signupSchema), userController.signup);

router.post('/login', validate(loginSchema), userController.login);

module.exports = router;