const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { createCategory, listCategories, getCategoryBySlug } = require('../controllers/categoryController');

router.post('/', verifyToken, createCategory);
router.get('/', listCategories);

// GET category by slug (public)
router.get('/:slug', getCategoryBySlug);

module.exports = router;
