const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true // For efficient querying by user
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'issue_created',
      'issue_assigned', 
      'issue_status_updated',
      'issue_resolved',
      'issue_closed',
      'officer_assigned',
      'vote_received',
      'system_alert',
      'admin_notification'
    ]
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  message: { 
    type: String, 
    required: true,
    trim: true
  },
  isRead: { 
    type: Boolean, 
    default: false,
    index: true // For efficient querying of unread notifications
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Optional fields for context
  issueId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Issue',
    required: false
  },
  officerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Officer',
    required: false
  },
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Expiration date for notifications (optional)
  expiresAt: {
    type: Date,
    required: false
  }
}, { 
  timestamps: true // createdAt & updatedAt
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to get notifications for user with pagination
notificationSchema.statics.getUserNotifications = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('issueId', 'title status category')
    .populate('officerId', 'fullName email');
};

module.exports = mongoose.model('Notification', notificationSchema);
