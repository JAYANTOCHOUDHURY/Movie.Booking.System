//Importing mongoose with MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exit(1);
  }
};

//Exporting this function to use in app.js
module.exports = connectDB;
