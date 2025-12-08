// backend/src/controllers/userController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); // ensure this file exists
const bcrypt = require('bcryptjs');


// Basic profile update (keeps previous behaviour you had)
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, bio, handle } = req.body;
    const update = {};

    if (name) update.name = name;
    if (bio !== undefined) update.bio = bio;

    if (handle) {
      const existing = await User.findOne({ handle: handle.toLowerCase(), _id: { $ne: userId } });
      if (existing) return res.status(400).json({ message: 'Handle already in use' });
      update.handle = handle.toLowerCase();
    }

    if (req.file) {
      // optionally remove old avatar (best-effort)
      const prev = await User.findById(userId).select('avatarUrl');
      if (prev && prev.avatarUrl && prev.avatarUrl.startsWith('/uploads/')) {
        // best-effort remove (no await)
        const fs = require('fs');
        const path = require('path');
        const p = path.join(process.cwd(), prev.avatarUrl);
        fs.unlink(p, () => {});
      }
      update.avatarUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash -__v').lean();
    if (!updated) return res.status(404).json({ message: 'User not found' });

    // add friendly counts
    updated.followersCount = Array.isArray(updated.followers) ? updated.followers.length : 0;
    updated.followingCount = Array.isArray(updated.following) ? updated.following.length : 0;
    updated.joinedAt = updated.createdAt;

    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
};

// change password (simple)
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId).select('passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hash;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { next(err); }
};

// public profile by id
exports.getPublicProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(id).select('-passwordHash -__v').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
    user.followingCount = Array.isArray(user.following) ? user.following.length : 0;
    user.joinedAt = user.createdAt;
    user.categoriesPreview = user.categories ? user.categories.slice(0,6) : [];

    res.json({ user });
  } catch (err) { next(err); }
};

// public profile by handle
exports.getPublicProfileByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle: handle.toLowerCase() }).select('-passwordHash -__v').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Get categories where user is a member
    const Category = require('../models/Category');
    const categories = await Category.find({ members: user._id }).select('title slug postCount').limit(10).lean();
    
    user.followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
    user.followingCount = Array.isArray(user.following) ? user.following.length : 0;
    user.joinedAt = user.createdAt;
    user.categoriesPreview = categories;
    res.json({ user });
  } catch (err) { next(err); }
};

// follow / unfollow helpers
exports.followUser = async (req, res, next) => {
  try {
    const me = req.user.id;
    const other = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(other)) return res.status(400).json({ message: 'Invalid id' });
    if (me === other) return res.status(400).json({ message: 'Cannot follow yourself' });

    await User.findByIdAndUpdate(other, { $addToSet: { followers: me } });
    await User.findByIdAndUpdate(me, { $addToSet: { following: other } });

    const updated = await User.findById(other).select('followers').lean();
    res.json({ message: 'Followed', followersCount: (updated.followers||[]).length });
  } catch (err) { next(err); }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const me = req.user.id;
    const other = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(other)) return res.status(400).json({ message: 'Invalid id' });
    await User.findByIdAndUpdate(other, { $pull: { followers: me } });
    await User.findByIdAndUpdate(me, { $pull: { following: other } });
    const updated = await User.findById(other).select('followers').lean();
    res.json({ message: 'Unfollowed', followersCount: (updated.followers||[]).length });
  } catch (err) { next(err); }
};

// Save a post (current user)
exports.savePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: 'Invalid post id' });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: post._id } });
    res.json({ message: 'Post saved' });
  } catch (err) { next(err); }
};

// Unsave a post
exports.unsavePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(400).json({ message: 'Invalid post id' });
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    res.json({ message: 'Post unsaved' });
  } catch (err) { next(err); }
};

// Get saved posts for a user (public)
exports.getSavedPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    const user = await User.findById(id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'name handle avatarUrl' }
    }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ saved: user.savedPosts || [] });
  } catch (err) { next(err); }
};

// Get posts that mention (tag) this user
exports.getTaggedPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    const posts = await Post.find({ mentions: id })
      .sort({ createdAt: -1 })
      .populate('author', 'name handle avatarUrl')
      .populate('category', 'title slug')
      .lean();
    res.json({ posts });
  } catch (err) { next(err); }
};

// Get comments by user (for profile)
exports.getCommentsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    const comments = await Comment.find({ author: id }).sort({ createdAt: -1 }).populate('postId', 'title').lean();
    res.json({ comments });
  } catch (err) { next(err); }
};

// Get user suggestions (people you may know)
exports.getUserSuggestions = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};
    
    // Get random users, excluding current user and their following
    const currentUser = currentUserId ? await User.findById(currentUserId).select('following').lean() : null;
    if (currentUser && currentUser.following?.length) {
      query._id = { $nin: [currentUserId, ...currentUser.following] };
    }
    
    const users = await User.find(query)
      .select('name handle avatarUrl bio')
      .limit(5)
      .lean();
    
    res.json({ users });
  } catch (err) { next(err); }
};

// Get categories where user is moderator
exports.getModeratedCategories = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    
    const Category = require('../models/Category');
    const categories = await Category.find({ moderators: id })
      .select('title slug postCount')
      .lean();
    
    res.json({ categories });
  } catch (err) { next(err); }
};
