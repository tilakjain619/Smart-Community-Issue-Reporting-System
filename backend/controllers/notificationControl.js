const Notification = require('../models/Notification');
const Issue = require('../models/Issue');
const Officer = require('../models/Officer');

// Get notifications for a specific user
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Build filter
        const filter = { userId };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const skip = (page - 1) * limit;
        
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('issueId', 'title status category')
            .populate('officerId', 'fullName email');

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.getUnreadCount(userId);

        res.status(200).json({
            notifications,
            pagination: {
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit),
                count: notifications.length
            },
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get unread notification count for a user
const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const unreadCount = await Notification.getUnreadCount(userId);
        res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.markAsRead();
        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ 
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findByIdAndDelete(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: error.message });
    }
};

// Create a notification (for internal use)
const createNotification = async (notificationData) => {
    try {
        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Send notification to multiple users
const sendNotificationToUsers = async (userIds, notificationData) => {
    try {
        const notifications = userIds.map(userId => ({
            ...notificationData,
            userId
        }));
        
        const createdNotifications = await Notification.insertMany(notifications);
        return createdNotifications;
    } catch (error) {
        console.error('Error sending notifications to users:', error);
        throw error;
    }
};

// Get notification statistics for admin
const getNotificationStats = async (req, res) => {
    try {
        const stats = await Notification.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    unreadCount: {
                        $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
                    }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const totalNotifications = await Notification.countDocuments();
        const totalUnread = await Notification.countDocuments({ isRead: false });

        res.status(200).json({
            totalNotifications,
            totalUnread,
            statsByType: stats
        });
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    sendNotificationToUsers,
    getNotificationStats
};
