const Notification = require('../models/Notification');

exports.listNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 30, page = 1, unreadOnly } = req.query;
    const q = { user: userId };
    if (unreadOnly === 'true' || unreadOnly === true) q.read = false;

    const skip = (page - 1) * limit;
    const items = await Notification.find(q)
      .sort({ read: 1, createdAt: -1 }) // unread first then newest
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('actor', 'name handle avatarUrl')
      .lean();

    const total = await Notification.countDocuments(q);
    res.json({ notifications: items, total });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.body; // optional single id, if missing mark all as read
    if (id) {
      await Notification.updateOne({ _id: id, user: userId }, { $set: { read: true }});
    } else {
      await Notification.updateMany({ user: userId, read: false }, { $set: { read: true }});
    }
    res.json({ message: 'Marked' });
  } catch (err) { next(err); }
};
