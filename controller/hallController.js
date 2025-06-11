const Hall = require('../models/Hall');

exports.createHall = async function(req, res){
  try {
    console.log("Request Body:", req.body); 

    const { name, theater, totalSeats, seatTypes } = req.body;

    const newHall = new Hall({ name, theater, totalSeats, seatTypes });
    await newHall.save();

    res.status(201).json({ message: "Hall created successfully", hall: newHall });
  } catch (err) {
    res.status(500).json({ message: "Error creating hall", error: err.message });
  }
};

