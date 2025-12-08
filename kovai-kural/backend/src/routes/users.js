const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { verifyToken, allowRoles } = require('../middlewares/auth');
const User = require('../models/User');
const { updateProfile, changePassword, getPublicProfileById, getPublicProfileByHandle, followUser, unfollowUser, savePost, unsavePost, getSavedPosts, getTaggedPosts, getCommentsByUser, getUserSuggestions, getModeratedCategories } = require('../controllers/userController');
const { getAnalytics } = require('../controllers/adminController');


// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  cb(null, uploadsPath);
},
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    // accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// GET /api/users/me
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/me  (form-data with optional avatar file)
router.put('/me', verifyToken, upload.single('avatar'), updateProfile);

// POST /api/users/me/password  (change password)
router.post('/me/password', verifyToken, changePassword);

// Save / unsave (authenticated)
router.post('/me/save/:postId', verifyToken, savePost);
router.post('/me/unsave/:postId', verifyToken, unsavePost);

// ADMIN routes (must come before /:id routes)
router.get('/all', verifyToken, allowRoles('ADMIN'), async (req, res, next) => {
  try {
    const users = await User.find().select('name handle email role createdAt').limit(200);
    res.json({ count: users.length, users });
  } catch (err) { next(err); }
});

router.get('/analytics', verifyToken, allowRoles('ADMIN'), getAnalytics);

// GET user suggestions
router.get('/suggestions', getUserSuggestions);

// GET by handle (must come before /:id to avoid conflict)
router.get('/handle/:handle', getPublicProfileByHandle);

// Public routes (by user id)
router.get('/:id/saved', getSavedPosts);
router.get('/:id/tagged', getTaggedPosts);
router.get('/:id/comments', getCommentsByUser);
router.get('/:id/moderated', getModeratedCategories);

// PUBLIC profile endpoints
router.get('/:id', getPublicProfileById);

// Follow / unfollow (authenticated)
router.post('/:id/follow', verifyToken, followUser);
router.post('/:id/unfollow', verifyToken, unfollowUser);

// Make user moderator (admin only)
router.post('/:id/promote', verifyToken, allowRoles('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'ADMIN') return res.status(400).json({ message: 'User is already an admin' });
    
    user.role = 'OFFICIAL';
    await user.save();
    res.json({ message: 'User promoted to moderator', user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { next(err); }
});

module.exports = router;
