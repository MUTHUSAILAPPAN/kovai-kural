// backend/src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  body: { type: String, default: '' },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  tags: [{ type: String }],
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['OPEN','FLAGGED','RESOLVED','INVALID'], default: 'OPEN' },
  votes: { type: Number, default: 0 }, // net votes (up - down)
  upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Post', postSchema);

