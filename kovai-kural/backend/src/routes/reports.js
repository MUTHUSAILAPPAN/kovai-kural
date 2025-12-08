const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/auth');
const { 
  createReport, 
  getReportsForModerator, 
  getAllReports, 
  updateReportStatus,
  deleteReportedContent 
} = require('../controllers/reportController');

// Create report (authenticated users)
router.post('/', verifyToken, createReport);

// Get reports for category (moderators)
router.get('/category/:categoryId', verifyToken, getReportsForModerator);

// Get all reports (admin only)
router.get('/all', verifyToken, allowRoles('ADMIN'), getAllReports);

// Update report status (moderators/admin)
router.put('/:id', verifyToken, updateReportStatus);

// Delete reported content (moderators/admin)
router.delete('/:reportId/content', verifyToken, deleteReportedContent);

module.exports = router;
