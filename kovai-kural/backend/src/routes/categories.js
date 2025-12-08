const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middlewares/auth');
const { createCategory, listCategories, getCategoryBySlug, getCategorySuggestions } = require('../controllers/categoryController');
const Category = require('../models/Category');

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
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  }
});

router.post('/', verifyToken, createCategory);
router.get('/', listCategories);

// GET suggestions (must come before /:slug)
router.get('/suggestions', getCategorySuggestions);

// GET category by slug (public)
router.get('/:slug', getCategoryBySlug);

// PUT update category (moderators only)
router.put('/:id', verifyToken, upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, rules } = req.body;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    // Check if user is moderator or admin
    const isMod = category.moderators.some(m => m.toString() === req.user.id);
    if (!isMod && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (description !== undefined) category.description = description;
    if (rules !== undefined) category.rules = rules;
    if (req.file) category.imageUrl = `/uploads/${req.file.filename}`;
    await category.save();
    res.json({ category });
  } catch (err) { next(err); }
});

// POST join category
router.post('/:id/join', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (!category.members.includes(req.user.id)) {
      category.members.push(req.user.id);
      await category.save();
    }
    res.json({ message: 'Joined category', memberCount: category.members.length });
  } catch (err) { next(err); }
});

// POST leave category
router.post('/:id/leave', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    category.members = category.members.filter(m => m.toString() !== req.user.id);
    await category.save();
    res.json({ message: 'Left category', memberCount: category.members.length });
  } catch (err) { next(err); }
});

module.exports = router;
