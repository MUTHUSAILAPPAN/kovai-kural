// backend/src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner of the notification
  type: { type: String, required: true }, // e.g. 'mention','reply','follow','resolved','points'
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who caused it
  entityType: { type: String }, // 'post','comment','user','category'
  entityId: { type: mongoose.Schema.Types.ObjectId },
  message: { type: String }, // short readable text
  read: { type: Boolean, default: false }
}, { timestamps: true });

// optional index to speed queries for a user's unread notifications
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
