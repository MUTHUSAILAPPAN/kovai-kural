// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  // expected format: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
};

// verifyToken: attaches req.user = { id, role, ... } if valid
const verifyToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'JWT_SECRET not configured' });

    const payload = jwt.verify(token, secret);
    // payload should contain id and role
    if (!payload || !payload.id) return res.status(401).json({ message: 'Invalid token payload' });

    // optional: fetch user from DB to confirm still active and attach more info
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    console.error('verifyToken error:', err.message || err);
    // jwt throws specific errors, but we return 401 for any token problems
    return res.status(401).json({ message: 'Unauthorized: token invalid or expired' });
  }
};

// allowRoles: returns middleware that enforces roles (one or many)
const allowRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No authenticated user' });
  if (allowedRoles.length === 0) return next(); // no restriction
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = {
  verifyToken,
  allowRoles
};
