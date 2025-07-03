const Joi = require('joi');

exports.signupSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(), 
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().valid('user', 'admin', 'theaterAdmin').required()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});