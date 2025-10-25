# Notification System Implementation

## Overview
A comprehensive notification system has been implemented for the Smart Community Issue Reporting System to alert users, officers, and admins about important updates such as issue assignments, status changes, and resolutions.

## Backend Implementation

### 1. Notification Model (`backend/models/Notification.js`)
- **Schema**: MongoDB schema with fields for userId, type, message, isRead, priority, and metadata
- **Types**: Supports various notification types (issue_created, issue_assigned, issue_status_updated, etc.)
- **Indexes**: Optimized for efficient querying by user and read status
- **TTL**: Automatic cleanup of old notifications after 30 days

### 2. Notification Controller (`backend/controllers/notificationControl.js`)
- `getUserNotifications`: Fetch notifications with pagination
- `getUnreadCount`: Get unread notification count
- `markAsRead`: Mark individual notifications as read
- `markAllAsRead`: Mark all notifications as read for a user
- `deleteNotification`: Delete specific notifications
- `getNotificationStats`: Admin statistics

### 3. Notification Utilities (`backend/utils/notificationUtils.js`)
- `notifyIssueCreated`: Send notifications when new issues are reported
- `notifyIssueStatusUpdate`: Alert users about status changes
- `notifyOfficerAssignment`: Notify when officers are assigned to issues
- `notifyVoteReceived`: Alert issue reporters about votes
- `notifySystemAlert`: Send system-wide alerts
- `notifyAdmin`: Send admin-specific notifications

### 4. API Endpoints (`backend/routes/notifications.js`)
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/user/:userId/unread-count` - Get unread count
- `PATCH /api/notifications/:notificationId/read` - Mark as read
- `PATCH /api/notifications/user/:userId/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification
- `GET /api/notifications/stats` - Get statistics (admin)

## Frontend Implementation

### 1. Notification Context (`frontend/src/contexts/NotificationContext.jsx`)
- Centralized state management for notifications
- Auto-refresh functionality (every 30 seconds)
- Real-time unread count updates
- Mark as read functionality

### 2. Notification Bell Component (`frontend/src/components/NotificationBell.jsx`)
- Bell icon with unread count badge
- Dropdown with recent notifications
- Priority-based styling
- Click-to-mark-as-read functionality
- Responsive design for mobile and desktop

### 3. Notifications Page (`frontend/src/pages/Notifications.jsx`)
- Full notification management interface
- Filter by read/unread status
- Pagination support
- Detailed notification view modal
- Mark all as read functionality

### 4. API Integration (`frontend/src/api/Notifications.js`)
- Complete API wrapper for all notification endpoints
- Error handling and token management
- TypeScript-ready structure

## Integration Points

### Issue Controller Integration
- **Issue Creation**: Automatically notifies officers and admins about new issues
- **Status Updates**: Notifies issue reporters about status changes
- **Voting**: Alerts issue reporters when their issues receive votes

### Officer Controller Integration
- **Officer Assignment**: New endpoint for assigning officers to issues
- **Assignment Notifications**: Notifies both officer and issue reporter

## Notification Types

1. **issue_created** - New issue reported
2. **issue_assigned** - Issue assigned to officer
3. **issue_status_updated** - Status change
4. **issue_resolved** - Issue resolved
5. **issue_closed** - Issue closed
6. **officer_assigned** - Officer assignment
7. **vote_received** - Vote received on issue
8. **system_alert** - System-wide alerts
9. **admin_notification** - Admin-specific notifications

## Priority Levels

- **urgent** - Critical notifications (red)
- **high** - Important notifications (orange)
- **medium** - Standard notifications (blue)
- **low** - Low priority notifications (gray)

## Features

### Real-time Updates
- Auto-refresh every 30 seconds
- Real-time unread count updates
- Instant notification marking

### User Experience
- Intuitive bell icon with badge
- Responsive design
- Priority-based visual indicators
- Time-based formatting
- Click-to-read functionality

### Admin Features
- Notification statistics
- System-wide alerts
- Bulk operations

### Performance Optimizations
- Database indexes for efficient querying
- Pagination for large notification lists
- TTL for automatic cleanup
- Context-based state management

## Usage Examples

### Backend Usage
```javascript
// Send notification when issue is created
await notifyIssueCreated(issue, reporterUserId);

// Send status update notification
await notifyIssueStatusUpdate(issue, previousStatus, updatedBy);

// Send officer assignment notification
await notifyOfficerAssignment(issue, officerId);
```

### Frontend Usage
```javascript
// Use notification context
const { notifications, unreadCount, markAsRead } = useNotifications();

// Mark notification as read
await markAsRead(notificationId);

// Fetch notifications
await fetchNotifications(page, limit, unreadOnly);
```

## Security Considerations

- All endpoints require authentication
- User-specific data isolation
- Admin-only statistics endpoint
- Input validation and sanitization

## Future Enhancements

1. **Email Notifications**: Extend to email alerts
2. **Push Notifications**: Browser push notifications
3. **Notification Preferences**: User-configurable settings
4. **Real-time WebSocket**: Live notification updates
5. **Notification Templates**: Customizable message templates
6. **Bulk Operations**: Advanced admin tools

## Testing

The notification system can be tested by:
1. Creating new issues (triggers notifications)
2. Updating issue status (triggers notifications)
3. Assigning officers (triggers notifications)
4. Voting on issues (triggers notifications)

All notifications will appear in the bell icon dropdown and the dedicated notifications page.
