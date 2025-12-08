const Report = require('../models/Report');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

// Create a report
exports.createReport = async (req, res, next) => {
  try {
    const { reportType, targetId, reason, customReason, category } = req.body;
    
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    
    // Check if already reported
    const existing = await Report.findOne({ 
      reportedBy: req.user.id, 
      targetId, 
      reportType 
    });
    
    if (existing) {
      return res.status(400).json({ message: 'You have already reported this' });
    }
    
    const targetModel = reportType === 'POST' ? 'Post' : reportType === 'USER' ? 'User' : 'Comment';
    
    const report = await Report.create({
      reportedBy: req.user.id,
      reportType,
      targetId,
      targetModel,
      reason,
      customReason: reason === 'OTHER' ? customReason : '',
      category: category || null
    });
    
    res.status(201).json({ report, message: 'Report submitted successfully' });
  } catch (err) {
    next(err);
  }
};

// Get reports for moderator (by category)
exports.getReportsForModerator = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    
    const { categoryId } = req.params;
    
    const reports = await Report.find({ 
      category: categoryId,
      status: { $in: ['PENDING', 'REVIEWED'] }
    })
      .populate('reportedBy', 'name handle')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ reports });
  } catch (err) {
    next(err);
  }
};

// Get all reports (admin only)
exports.getAllReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const reports = await Report.find(query)
      .populate('reportedBy', 'name handle')
      .populate('targetId')
      .populate('category', 'title slug')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ reports });
  } catch (err) {
    next(err);
  }
};

// Update report status
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      id,
      { 
        status, 
        reviewNote,
        reviewedBy: req.user.id 
      },
      { new: true }
    );
    
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    res.json({ report, message: 'Report updated' });
  } catch (err) {
    next(err);
  }
};

// Delete reported content
exports.deleteReportedContent = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // Delete the content based on type
    if (report.targetModel === 'Post') {
      await Post.findByIdAndDelete(report.targetId);
    } else if (report.targetModel === 'Comment') {
      await Comment.findByIdAndDelete(report.targetId);
    }
    
    // Update report status
    report.status = 'RESOLVED';
    report.reviewedBy = req.user.id;
    report.reviewNote = 'Content deleted';
    await report.save();
    
    res.json({ message: 'Content deleted and report resolved' });
  } catch (err) {
    next(err);
  }
};
