const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { registerValidator, loginValidator } = require('../utils/validators');

// POST /api/auth/register
router.post("/register", registerValidator, register);

// POST /api/auth/login
router.post("/login", loginValidator, login);

module.exports = router;
