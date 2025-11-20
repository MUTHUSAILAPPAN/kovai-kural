// src/server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
// server.js (after app created)
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }});

const notifications = require('./lib/notifications');
notifications.attachSocket(io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  // verify token and attach user id (reuse your jwt verify logic)
  try {
    const user = verifyTokenFromSocket(token); // implement helper returning user object
    socket.user = user;
    return next();
  } catch (err) { return next(); }
});

io.on('connection', (socket) => {
  if (socket.user && socket.user.id) {
    // join a room for the user
    socket.join(`user_${socket.user.id}`);
  }
  socket.on('disconnect', () => {});
});

// start server
server.listen(PORT, () => console.log(`Listening ${PORT}`));

(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Closing server...`);
      server.close(() => {
        console.log('HTTP server closed.');
        // close DB connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
})();
