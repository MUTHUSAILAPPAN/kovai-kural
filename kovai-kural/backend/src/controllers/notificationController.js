const Notification = require('../models/Notification');

exports.listNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 30, unreadOnly } = req.query;
    const q = { recipient: userId };
    if (unreadOnly === 'true') q.read = false;

    const items = await Notification.find(q)
      .sort({ read: 1, createdAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });
    res.json({ notifications: items, unreadCount });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;
    if (id) {
      await Notification.updateOne({ _id: id, recipient: userId }, { $set: { read: true }});
    } else {
      await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true }});
    }
    res.json({ message: 'Marked as read' });
  } catch (err) { next(err); }
};
