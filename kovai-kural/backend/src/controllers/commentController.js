// backend/src/controllers/commentController.js
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// create comment or reply
exports.createComment = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { postId } = req.params;
    const { body, parentComment } = req.body;
    if (!body || !body.trim()) return res.status(400).json({ message: 'Comment body required' });

    // optional check: parentComment belongs to same post
    if (parentComment && !mongoose.Types.ObjectId.isValid(parentComment)) {
      return res.status(400).json({ message: 'Invalid parentComment id' });
    }

    const c = await Comment.create({
      postId,
      author: req.user.id,
      parentComment: parentComment || null,
      body
    });

    await c.populate('author', 'name handle avatarUrl');

    res.status(201).json({ comment: c });
  } catch (err) { next(err); }
};

// list comments for a post as nested tree
exports.listCommentsForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate('author', 'name handle avatarUrl')
      .lean();

    // build tree (simple O(n))
    const map = {};
    comments.forEach(c => { c.children = []; map[c._id] = c; });
    const roots = [];
    comments.forEach(c => {
      if (c.parentComment) {
        const parent = map[c.parentComment.toString()];
        if (parent) parent.children.push(c);
        else roots.push(c); // parent missing => treat as root
      } else {
        roots.push(c);
      }
    });

    res.json({ count: comments.length, comments: roots });
  } catch (err) { next(err); }
};
