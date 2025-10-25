const { requireAuth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationStats
} = require('../controllers/notificationControl');

// Get notifications for a specific user
router.get('/user/:userId', requireAuth(), getUserNotifications);

// Get unread notification count for a user
router.get('/user/:userId/unread-count', requireAuth(), getUnreadCount);

// Mark a specific notification as read
router.patch('/:notificationId/read', requireAuth(), markAsRead);

// Mark all notifications as read for a user
router.patch('/user/:userId/mark-all-read', requireAuth(), markAllAsRead);

// Delete a notification
router.delete('/:notificationId', requireAuth(), deleteNotification);

// Get notification statistics (admin only)
router.get('/stats', requireAuth(), getNotificationStats);

module.exports = router;
