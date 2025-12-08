const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Category = require('../models/Category');

exports.getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalCategories,
      recentUsers,
      recentPosts,
      topUsers,
      postsByStatus
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Category.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name handle createdAt'),
      Post.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name handle').select('title createdAt'),
      User.find().sort({ points: -1 }).limit(5).select('name handle points'),
      Post.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusMap = postsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalCategories,
      recentUsers,
      recentPosts,
      topUsers,
      postsByStatus: statusMap
    });
  } catch (err) {
    next(err);
  }
};
