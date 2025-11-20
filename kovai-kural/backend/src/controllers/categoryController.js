const Category = require('../models/Category');
// add near other exports in backend/src/controllers/categoryController.js
const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.createCategory = async (req, res, next) => {
  try {
    const { title, description = '', rules = '' } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    // create slug (simple)
    const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,'');
    let slug = slugBase;
    let i = 1;
    // ensure unique
    while (await Category.findOne({ slug })) {
      slug = `${slugBase}-${i++}`;
    }

    // make creator the moderator if authenticated
    const moderators = [];
    if (req.user && req.user.id) moderators.push(req.user.id);

    const cat = await Category.create({ title, slug, description, rules, moderators, members: moderators });

    res.status(201).json({ category: cat });
  } catch (err) { next(err); }
};

exports.listCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ title: 1 }).limit(200);
    res.json({ categories: cats });
  } catch (err) { next(err); }
};


exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: 'slug required' });

    // find category and populate basic moderator info
    const category = await Category.findOne({ slug: slug.toLowerCase() })
      .select('-__v')
      .populate({ path: 'moderators', select: 'name handle avatarUrl' })
      .lean();

    if (!category) return res.status(404).json({ message: 'Category not found' });

    // fetch posts in this category (paged or top 50)
    const posts = await Post.find({ category: category._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('author', 'name handle avatarUrl')
      .lean();

    // return category + posts (and small member count)
    category.membersCount = Array.isArray(category.members) ? category.members.length : 0;
    category.postCount = category.postCount || posts.length;

    res.json({ category, posts });
  } catch (err) {
    next(err);
  }
};

