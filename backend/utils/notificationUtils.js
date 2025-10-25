const Notification = require('../models/Notification');
const Officer = require('../models/Officer');

/**
 * Notification utility functions for sending various types of notifications
 */

// Send notification when an issue is created
const notifyIssueCreated = async (issue, reporterUserId) => {
    try {
        // Notify admins and officers about new issue
        const officers = await Officer.find({});
        const officerUserIds = officers.map(officer => officer._id.toString());
        
        // Also notify the reporter
        const allUserIds = [...officerUserIds, reporterUserId];
        
        const notificationData = {
            type: 'issue_created',
            title: 'New Issue Reported',
            message: `A new issue "${issue.title}" has been reported in ${issue.city}, ${issue.state}`,
            priority: 'medium',
            issueId: issue._id,
            metadata: {
                category: issue.category,
                location: `${issue.city}, ${issue.state}`,
                reporterId: reporterUserId
            }
        };

        await Notification.insertMany(
            allUserIds.map(userId => ({
                ...notificationData,
                userId
            }))
        );

        console.log(`📢 Notified ${allUserIds.length} users about new issue: ${issue.title}`);
    } catch (error) {
        console.error('Error sending issue created notification:', error);
    }
};

// Send notification when an issue status is updated
const notifyIssueStatusUpdate = async (issue, previousStatus, updatedBy) => {
    try {
        const statusMessages = {
            'open': 'Issue is now open',
            'in progress': 'Issue is now in progress',
            'pending': 'Issue is pending review',
            'closed': 'Issue has been closed',
            'resolved': 'Issue has been resolved'
        };

        const priority = issue.status === 'resolved' ? 'high' : 'medium';
        
        const notificationData = {
            type: 'issue_status_updated',
            title: 'Issue Status Updated',
            message: `Issue "${issue.title}" status changed from "${previousStatus}" to "${issue.status}"`,
            priority,
            issueId: issue._id,
            metadata: {
                previousStatus,
                newStatus: issue.status,
                updatedBy,
                location: `${issue.city}, ${issue.state}`
            }
        };

        // Notify the issue reporter
        await Notification.create({
            ...notificationData,
            userId: issue.userId
        });

        // If resolved, also notify officers
        if (issue.status === 'resolved') {
            const officers = await Officer.find({});
            const officerUserIds = officers.map(officer => officer._id.toString());
            
            await Notification.insertMany(
                officerUserIds.map(userId => ({
                    ...notificationData,
                    userId
                }))
            );
        }

        console.log(`📢 Notified users about status update: ${issue.title} - ${previousStatus} → ${issue.status}`);
    } catch (error) {
        console.error('Error sending status update notification:', error);
    }
};

// Send notification when an officer is assigned to an issue
const notifyOfficerAssignment = async (issue, officerId) => {
    try {
        const officer = await Officer.findById(officerId);
        if (!officer) {
            console.error('Officer not found for assignment notification');
            return;
        }

        const notificationData = {
            type: 'officer_assigned',
            title: 'Issue Assigned to Officer',
            message: `Issue "${issue.title}" has been assigned to Officer ${officer.fullName}`,
            priority: 'high',
            issueId: issue._id,
            officerId: officer._id,
            metadata: {
                officerName: officer.fullName,
                officerEmail: officer.email,
                location: `${issue.city}, ${issue.state}`,
                category: issue.category
            }
        };

        // Notify the assigned officer
        await Notification.create({
            ...notificationData,
            userId: officerId
        });

        // Notify the issue reporter
        await Notification.create({
            ...notificationData,
            userId: issue.userId,
            title: 'Your Issue Has Been Assigned',
            message: `Your issue "${issue.title}" has been assigned to Officer ${officer.fullName}`
        });

        console.log(`📢 Notified officer ${officer.fullName} and reporter about assignment: ${issue.title}`);
    } catch (error) {
        console.error('Error sending officer assignment notification:', error);
    }
};

// Send notification when an issue receives a vote
const notifyVoteReceived = async (issue, voterUserId) => {
    try {
        const notificationData = {
            type: 'vote_received',
            title: 'Issue Received a Vote',
            message: `Your issue "${issue.title}" received a vote (Total: ${issue.votes})`,
            priority: 'low',
            issueId: issue._id,
            metadata: {
                totalVotes: issue.votes,
                voterId: voterUserId,
                location: `${issue.city}, ${issue.state}`
            }
        };

        // Only notify the issue reporter if they're not the one who voted
        if (issue.userId !== voterUserId) {
            await Notification.create({
                ...notificationData,
                userId: issue.userId
            });
        }

        console.log(`📢 Notified reporter about vote on issue: ${issue.title}`);
    } catch (error) {
        console.error('Error sending vote notification:', error);
    }
};

// Send system alert notification
const notifySystemAlert = async (userIds, title, message, priority = 'medium', metadata = {}) => {
    try {
        const notificationData = {
            type: 'system_alert',
            title,
            message,
            priority,
            metadata
        };

        await Notification.insertMany(
            userIds.map(userId => ({
                ...notificationData,
                userId
            }))
        );

        console.log(`📢 Sent system alert to ${userIds.length} users: ${title}`);
    } catch (error) {
        console.error('Error sending system alert:', error);
    }
};

// Send admin notification
const notifyAdmin = async (adminUserIds, title, message, priority = 'high', metadata = {}) => {
    try {
        const notificationData = {
            type: 'admin_notification',
            title,
            message,
            priority,
            metadata
        };

        await Notification.insertMany(
            adminUserIds.map(userId => ({
                ...notificationData,
                userId
            }))
        );

        console.log(`📢 Sent admin notification to ${adminUserIds.length} admins: ${title}`);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
};

// Clean up old notifications (older than 30 days)
const cleanupOldNotifications = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Notification.deleteMany({
            createdAt: { $lt: thirtyDaysAgo },
            isRead: true
        });

        console.log(`🧹 Cleaned up ${result.deletedCount} old notifications`);
        return result.deletedCount;
    } catch (error) {
        console.error('Error cleaning up old notifications:', error);
        throw error;
    }
};

module.exports = {
    notifyIssueCreated,
    notifyIssueStatusUpdate,
    notifyOfficerAssignment,
    notifyVoteReceived,
    notifySystemAlert,
    notifyAdmin,
    cleanupOldNotifications
};
