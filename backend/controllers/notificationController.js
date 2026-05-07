const Notification = require('../models/Notification');

const listNotifications = async (req, res, next) => {
  try {
    const status = String(req.query.status || '').toLowerCase();
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const filter = { userId: req.user._id };
    if (status === 'unread') {
      filter.readStatus = false;
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(limit),
      Notification.countDocuments({ userId: req.user._id, readStatus: false })
    ]);

    return res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { readStatus: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json({ notification });
  } catch (error) {
    next(error);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, readStatus: false }, { readStatus: true });
    return res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listNotifications, markRead, markAllRead };

