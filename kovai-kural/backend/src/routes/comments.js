const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { voteComment, deleteComment } = require('../controllers/commentController');

// POST /api/comments/:id/vote
router.post('/:id/vote', verifyToken, voteComment);

// DELETE /api/comments/:id
router.delete('/:id', verifyToken, deleteComment);

module.exports = router;
