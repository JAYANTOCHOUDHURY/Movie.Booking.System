const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/userRoutes.js');
const authRoute = require('./routes/authRoute.js');
const movieRoute = require('./routes/movieRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const adminRoutes = require('./routes/adminRoute.js');
const theaterRoutes = require('./routes/theaterRoutes.js');
const hallRoutes = require('./routes/hallRoutes');



const connectDB = require('./config/my_db');
require('dotenv').config();

const app = express();

app.use(express.json());

function middlewareForTimeLog(req, res, next) {
  console.log("Server Interacted with: " + new Date());
  next();
}

app.use(middlewareForTimeLog);
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/test', authRoute);
app.use('/api/movies', movieRoute);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/movies', movieRoute);

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
