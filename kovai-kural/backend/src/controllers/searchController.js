// backend/src/controllers/searchController.js
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type || 'all'; // 'posts' | 'users' | 'categories' | 'all'
    const limit = Math.min(parseInt(req.query.limit || 12, 10), 50);
    const page = Math.max(parseInt(req.query.page || 1, 10), 1);
    const skip = (page - 1) * limit;

    if (!q) return res.json({ posts: [], users: [], categories: [], total: 0 });

    // Prefer text index search (fast and ranked)
    const textSearch = { $text: { $search: q } };

    const results = { posts: [], users: [], categories: [], total: 0 };

    if (type === 'posts' || type === 'all') {
      const cursor = Post.find(textSearch, { score: { $meta: "textScore" } })
                        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
                        .skip(skip).limit(limit)
                        .populate('author', 'name handle avatarUrl')
                        .populate('category', 'title slug')
                        .lean();
      const docs = await cursor;
      results.posts = docs;
      results.total += docs.length;
    }

    if (type === 'users' || type === 'all') {
      const cursor = User.find(textSearch, { score: { $meta: "textScore" } })
                         .sort({ score: { $meta: "textScore" } })
                         .skip(skip).limit(limit)
                         .select('name handle avatarUrl bio')
                         .lean();
      const docs = await cursor;
      results.users = docs;
      results.total += docs.length;
    }

    if (type === 'categories' || type === 'all') {
      const cursor = Category.find(textSearch, { score: { $meta: "textScore" } })
                              .sort({ score: { $meta: "textScore" }})
                              .skip(skip).limit(limit)
                              .lean();
      const docs = await cursor;
      results.categories = docs;
      results.total += docs.length;
    }

    // fallback: if text index yields nothing (or you want fuzzy), do case-insensitive regex search
    // Omitted for brevity — implement if you need.

    res.json(results);
  } catch (err) {
    next(err);
  }
}
