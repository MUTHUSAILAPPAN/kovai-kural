const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  rules: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postCount: { type: Number, default: 0 }
}, { timestamps: true });

categorySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Category', categorySchema);
