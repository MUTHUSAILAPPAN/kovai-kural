// src/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const healthRoutes = require('./routes/health');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandlers');
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/users');

const app = express();

// Basic middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' })); // adjust limit for images
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/health', healthRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.json({ service: 'Kovai Kural Backend', status: 'ok' });
});



app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);


// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
