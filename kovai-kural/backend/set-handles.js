// backend/set-handles.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  for (const u of users) {
    if (!u.handle) {
      let base = slugify(u.name || u.email.split('@')[0] || 'user');
      let candidate = base;
      let i = 1;
      while (await User.findOne({ handle: candidate })) {
        candidate = `${base}${i++}`;
      }
      u.handle = candidate;
      await u.save();
      console.log('Set handle', u.email, '->', candidate);
    }
  }
  await mongoose.disconnect();
  console.log('Done');
  process.exit(0);
})();
