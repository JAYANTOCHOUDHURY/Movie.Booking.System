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
const showRoutes = require('./routes/showtimeRoutes.js');
const setupSwagger = require('./swagger.js');



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
app.use('/users', userRoutes);
app.use('/test', authRoute);
app.use('/movies', movieRoute);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
app.use('/theaters', theaterRoutes);
app.use('/halls', hallRoutes);
app.use('/shows', showRoutes);

setupSwagger(app);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Movie Booking System API!');
});

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
