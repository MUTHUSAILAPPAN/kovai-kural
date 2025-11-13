// src/routes/health.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    service: 'Kovai Kural Backend',
    environment: process.env.NODE_ENV || 'development',
    db: {
      state: dbState,
      readable: stateMap[dbState] || 'unknown'
    },
    time: new Date().toISOString()
  });
});

module.exports = router;
