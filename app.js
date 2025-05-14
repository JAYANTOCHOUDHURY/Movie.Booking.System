const express = require('express');
const connectDB = require('./config/my_db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Movie Booking System API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
