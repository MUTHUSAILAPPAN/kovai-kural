// backend/src/controllers/postController.js
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.createPost = async (req, res, next) => {
    const mentionsInput = req.body.mentions; // could be CSV, JSON array, or empty
let mentions = [];
if (mentionsInput) {
  // accept JSON array or CSV string of handles/ids
  let arr = [];
  if (typeof mentionsInput === 'string') {
    try { arr = JSON.parse(mentionsInput); } catch(e) { arr = mentionsInput.split(',').map(s => s.trim()).filter(Boolean); }
  } else if (Array.isArray(mentionsInput)) arr = mentionsInput;

  // resolve handles -> user ids; accept if already ObjectId
  const mentionIds = [];
  for (const token of arr) {
    if (!token) continue;
    // if looks like ObjectId
    if (mongoose.Types.ObjectId.isValid(token)) {
      mentionIds.push(token);
      continue;
    }
    // try lookup by handle
    const u = await User.findOne({ handle: token.toLowerCase() }).select('_id');
    if (u) mentionIds.push(u._id);
  }
  mentions = mentionIds;
}

  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });

    const { title, body, category: categoryId } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const images = [];
    if (req.files && req.files.length) {
      for (const f of req.files) images.push(`/uploads/${f.filename}`);
    } else if (req.file) {
      images.push(`/uploads/${req.file.filename}`);
    }

    let categoryRef = null;
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      const cat = await Category.findById(categoryId);
      if (cat) categoryRef = cat._id;
    }

    const post = await Post.create({
      author: req.user.id,
      title,
      body,
      images,
      category: categoryRef,
      mentions
    });

    // modern populate (no execPopulate)
    await post.populate({ path: 'author', select: 'name handle avatarUrl' });
    await post.populate({ path: 'category', select: 'title slug' });

    if (categoryRef) {
      const cat = await Category.findByIdAndUpdate(categoryRef, { $inc: { postCount: 1 }, $addToSet: { members: req.user.id } }, { new: true });
      
      // Notify category members
      if (cat && cat.members.length > 0) {
        const notifications = cat.members
          .filter(m => m.toString() !== req.user.id)
          .map(memberId => ({
            recipient: memberId,
            type: 'NEW_POST',
            message: `New post in ${cat.title}: ${title}`,
            postId: post._id
          }));
        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      }
    }

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const post = await Post.findById(id)
      .populate('author', 'name handle avatarUrl')
      .populate('category', 'title slug')
      .populate('mentions', 'name handle avatarUrl')
      .lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) { next(err); }
};

exports.listPosts = async (req, res, next) => {
  try {
    const { limit = 20, sort } = req.query;
    const q = {};
    const sortObj = sort === 'recent' ? { createdAt: -1 } : { createdAt: -1 };

    if (req.query.author && mongoose.Types.ObjectId.isValid(req.query.author)) {
  q.author = req.query.author;
}
if (req.query.category && mongoose.Types.ObjectId.isValid(req.query.category)) {
  q.category = req.query.category;
}

    const posts = await Post.find(q)
      .sort(sortObj)
      .limit(parseInt(limit, 10))
      .populate('author', 'name handle avatarUrl')
      .populate('category', 'title slug')
      .populate('mentions', 'name handle avatarUrl');

    res.json({ posts });
  } catch (err) { next(err); }
};

// Delete post: DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Vote endpoint: POST /api/posts/:id/vote { type: 'up' | 'down' }
exports.vote = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { id } = req.params;
    const { type } = req.body;
    if (!['up', 'down'].includes(type)) return res.status(400).json({ message: 'type must be "up" or "down"' });

    const post = await Post.findById(id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id.toString();

    const alreadyUp = post.upvoters.some(u => u.toString() === userId);
    const alreadyDown = post.downvoters.some(u => u.toString() === userId);

    let shouldNotify = false;

    if (type === 'up') {
      if (alreadyUp) {
        // remove upvote (toggle)
        post.upvoters = post.upvoters.filter(u => u.toString() !== userId);
      } else {
        post.upvoters.push(userId);
        shouldNotify = true;
        // remove down if present
        if (alreadyDown) post.downvoters = post.downvoters.filter(u => u.toString() !== userId);
      }
    } else { // down
      if (alreadyDown) {
        post.downvoters = post.downvoters.filter(u => u.toString() !== userId);
      } else {
        post.downvoters.push(userId);
        if (alreadyUp) post.upvoters = post.upvoters.filter(u => u.toString() !== userId);
      }
    }

    // recompute net votes
    post.votes = (post.upvoters ? post.upvoters.length : 0) - (post.downvoters ? post.downvoters.length : 0);
    await post.save();

    // Notify post author on upvote
    if (shouldNotify && post.author._id.toString() !== userId) {
      await Notification.create({
        recipient: post.author._id,
        type: 'VOTE',
        message: `Someone upvoted your post: ${post.title}`,
        postId: post._id
      });
    }

    // return counts
    res.json({
      message: 'Vote updated',
      votes: post.votes,
      upvotersCount: post.upvoters.length,
      downvotersCount: post.downvoters.length
    });
  } catch (err) {
    next(err);
  }
};
