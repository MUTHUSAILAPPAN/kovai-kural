const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, enum: ['POST', 'USER', 'COMMENT'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetModel: { type: String, enum: ['Post', 'User', 'Comment'], required: true },
  reason: { 
    type: String, 
    enum: ['SPAM', 'HARASSMENT', 'INAPPROPRIATE', 'MISINFORMATION', 'OTHER'], 
    required: true 
  },
  customReason: { type: String, default: '' },
  status: { type: String, enum: ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'], default: 'PENDING' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNote: { type: String, default: '' }
}, { timestamps: true });

reportSchema.index({ targetId: 1, reportedBy: 1 });
reportSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Report', reportSchema);
