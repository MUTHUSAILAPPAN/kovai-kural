const Notification = require('../models/Notification');
// optional: socket manager
let io = null;
exports.attachSocket = (socketIo) => { io = socketIo; };

exports.createNotification = async ({ userId, type, actorId, entityType, entityId, message }) => {
  const n = await Notification.create({
    user: userId, type, actor: actorId, entityType, entityId, message
  });
  // emit socket event if present
  if (io) {
    io.to(`user_${userId}`).emit('notification', n);
  }
  return n;
}
