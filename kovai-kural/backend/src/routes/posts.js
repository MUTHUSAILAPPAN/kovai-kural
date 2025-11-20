const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middlewares/auth');
const { createPost, listPosts, vote } = require('../controllers/postController');
const { createComment, listCommentsForPost } = require('../controllers/commentController');

// multer storage (as before)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  cb(null, uploadsPath);
},
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 4 * 1024 * 1024 } });

// create post - support multiple images under field 'images'
router.post('/', verifyToken, upload.array('images', 4), createPost);

// list posts
router.get('/', listPosts);

// vote
router.post('/:id/vote', verifyToken, vote);

// comments: create & list
router.post('/:postId/comments', verifyToken, createComment);
router.get('/:postId/comments', listCommentsForPost);

module.exports = router;
