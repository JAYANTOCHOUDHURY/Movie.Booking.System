const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

exports.signup = async function (req, res) {
    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({
            message: "User registered Succesfully",
            userId: user._id
        });
    }
    catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Something went wrong. Please try again later.", err: err.message});
    }
};

exports.login = async function(req, res){
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid Email or Password!!!!'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid Email or Password"})
        }

        const token = jwt.sign(
            {
                userId: user._id, email: user.email, role: user.role
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: '1h'
            }
        );
        res.status(200).json({
            message: "Login Successful", 
            token, 
            userId: user._id, 
            role: user.role
        });
    }
    catch(err){
        res.status(500).json({message: "Login Failed", err: err.message});
    }
};