// src/middlewares/errorHandlers.js

const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      // only include stack in non-production
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
    }
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
