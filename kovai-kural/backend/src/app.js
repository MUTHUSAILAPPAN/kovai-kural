// src/app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const healthRoutes = require('./routes/health');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandlers');
const authRoutes = require("./routes/auth");
const userRoutes = require('./routes/users');

const postsRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');
const commentsRoutes = require('./routes/comments');

const searchRoutes = require('./routes/search');
const notificationsRoutes = require('./routes/notifications');
const reportsRoutes = require('./routes/reports');



const fs = require('fs');

const app = express();

// Rate limiting - only for write operations to prevent abuse
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased limit for development
  message: 'Too many requests, please try again later.',
  skip: (req) => req.method === 'GET' // skip rate limiting for GET requests
});
app.use('/api/', writeLimiter);

// Basic middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' })); // adjust limit for images
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// static uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory at:', uploadsPath);
} else {
  console.log('Using uploads directory at:', uploadsPath);
}

// Serve uploads with permissive headers for dev
app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use('/uploads', express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    // allow cross-origin image loading from frontend dev server
    res.setHeader('Access-Control-Allow-Origin', '*')

    // if some browser enforces Cross-Origin-Resource-Policy, allow cross-origin:
    // remove or override any restrictive header if present. You can set:
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  }
}))

// Routes
app.use('/api/health', healthRoutes);

app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationsRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.json({ service: 'Kovai Kural Backend', status: 'ok' });
});



app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);

app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reports', reportsRoutes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
