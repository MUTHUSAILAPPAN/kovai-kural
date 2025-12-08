// backend/src/controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
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

    // Notify post author
    const post = await Post.findById(postId).select('author title');
    if (post && post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        type: 'COMMENT',
        message: `Someone commented on your post: ${post.title}`,
        postId: post._id,
        commentId: c._id
      });
    }

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

// vote on comment
exports.voteComment = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { id } = req.params;
    const { type } = req.body;
    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    const userId = req.user.id;
    const hasUpvoted = comment.upvoters?.includes(userId);
    const hasDownvoted = comment.downvoters?.includes(userId);

    if (type === 'up') {
      if (hasUpvoted) {
        // Remove upvote
        comment.upvoters = comment.upvoters.filter(id => id.toString() !== userId);
        comment.votes -= 1;
      } else {
        // Add upvote, remove downvote if exists
        if (hasDownvoted) {
          comment.downvoters = comment.downvoters.filter(id => id.toString() !== userId);
          comment.votes += 1;
        }
        comment.upvoters.push(userId);
        comment.votes += 1;
      }
    } else {
      if (hasDownvoted) {
        // Remove downvote
        comment.downvoters = comment.downvoters.filter(id => id.toString() !== userId);
        comment.votes += 1;
      } else {
        // Add downvote, remove upvote if exists
        if (hasUpvoted) {
          comment.upvoters = comment.upvoters.filter(id => id.toString() !== userId);
          comment.votes -= 1;
        }
        comment.downvoters.push(userId);
        comment.votes -= 1;
      }
    }
    
    await comment.save();

    // Notify comment author on upvote
    if (type === 'up' && !hasUpvoted && comment.author.toString() !== userId) {
      await Notification.create({
        recipient: comment.author,
        type: 'VOTE',
        message: 'Someone upvoted your comment',
        commentId: comment._id,
        postId: comment.postId
      });
    }

    res.json({ votes: comment.votes, hasUpvoted: comment.upvoters.includes(userId), hasDownvoted: comment.downvoters.includes(userId) });
  } catch (err) { next(err); }
};

// delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid comment id' });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only author or admin can delete
    if (comment.author.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) { next(err); }
};
