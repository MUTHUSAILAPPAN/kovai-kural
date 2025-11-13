// quick promote script (run once)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const u = await User.findOne({ email: 'testuser@example.com' });
  if (!u) return console.log('User not found');
  u.role = 'ADMIN';
  await u.save();
  console.log('Promoted', u.email, '->', u.role);
  await mongoose.disconnect();
})();
