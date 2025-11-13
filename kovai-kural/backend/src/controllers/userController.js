const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;
    const update = {};

    if (name) update.name = name;
    if (bio !== undefined) update.bio = bio;

    // if multer put file in req.file, update avatarUrl
    if (req.file) {
      // remove old avatar file if it exists and is local
      const user = await User.findById(userId).select('avatarUrl');
      if (user && user.avatarUrl && user.avatarUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', '..', user.avatarUrl);
        // best-effort remove
        fs.unlink(oldPath, (err) => { if (err) {/* ignore */} });
      }

      update.avatarUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash -__v');
    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'currentPassword and newPassword required' });

    const user = await User.findById(userId).select('passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

// PUBLIC profile by user id
exports.getPublicProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select('name handle bio avatarUrl points counts followers following createdAt')
      .populate('followers', 'handle name avatarUrl')
      .populate('following', 'handle name avatarUrl');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // shape response: counts and limited follower info
    res.json({
      user: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        points: user.points,
        counts: user.counts,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        // include small arrays (caps) for preview (max 10)
        followersPreview: user.followers.slice(0, 10),
        followingPreview: user.following.slice(0, 10),
        joinedAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// PUBLIC profile by handle
exports.getPublicProfileByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const user = await User.findOne({ handle: handle.toLowerCase() })
      .select('name handle bio avatarUrl points counts followers following createdAt')
      .populate('followers', 'handle name avatarUrl')
      .populate('following', 'handle name avatarUrl');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        handle: user.handle,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        points: user.points,
        counts: user.counts,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        followersPreview: user.followers.slice(0, 10),
        followingPreview: user.following.slice(0, 10),
        joinedAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// follow a user
exports.followUser = async (req, res, next) => {
  try {
    const meId = req.user.id;
    const { id: targetId } = req.params;

    if (meId === targetId) return res.status(400).json({ message: "You cannot follow yourself" });

    const me = await User.findById(meId);
    const target = await User.findById(targetId);

    if (!me || !target) return res.status(404).json({ message: 'User not found' });

    // already following?
    if (target.followers.includes(me._id)) {
      return res.status(400).json({ message: 'Already following' });
    }

    target.followers.push(me._id);
    me.following.push(target._id);

    await target.save();
    await me.save();

    res.json({ message: `Now following ${target.handle}`, followersCount: target.followers.length });
  } catch (err) {
    next(err);
  }
};

// unfollow
exports.unfollowUser = async (req, res, next) => {
  try {
    const meId = req.user.id;
    const { id: targetId } = req.params;

    if (meId === targetId) return res.status(400).json({ message: "You cannot unfollow yourself" });

    const me = await User.findById(meId);
    const target = await User.findById(targetId);

    if (!me || !target) return res.status(404).json({ message: 'User not found' });

    target.followers = target.followers.filter(f => f.toString() !== meId);
    me.following = me.following.filter(f => f.toString() !== targetId);

    await target.save();
    await me.save();

    res.json({ message: `Unfollowed ${target.handle}`, followersCount: target.followers.length });
  } catch (err) {
    next(err);
  }
};
