import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationsPage = () => {
    const { notifications, unreadCount, loading, error, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const limit = 20;

    useEffect(() => {
        if (user) {
            fetchNotifications(currentPage, limit, showUnreadOnly);
        }
    }, [user, currentPage, showUnreadOnly, fetchNotifications, limit]);

    // Format notification time
    const formatTime = (createdAt) => {
        const now = new Date();
        const notificationTime = new Date(createdAt);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Get notification icon
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'issue_created':
                return '📝';
            case 'issue_assigned':
                return '👮';
            case 'issue_status_updated':
                return '🔄';
            case 'issue_resolved':
                return '✅';
            case 'issue_closed':
                return '🔒';
            case 'officer_assigned':
                return '👤';
            case 'vote_received':
                return '👍';
            case 'system_alert':
                return '⚠️';
            case 'admin_notification':
                return '🔔';
            default:
                return '📢';
        }
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }
        setSelectedNotification(notification);
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        setShowUnreadOnly(filter === 'unread');
        setCurrentPage(1);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view notifications</h2>
                    <p className="text-gray-600">You need to be logged in to see your notifications.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="text-gray-600 mt-1">
                                {unreadCount > 0 
                                    ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                                    : 'All caught up!'
                                }
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                !showUnreadOnly 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All Notifications
                        </button>
                        <button
                            onClick={() => handleFilterChange('unread')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                                showUnreadOnly 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Unread Only
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading notifications...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="text-red-400">⚠️</div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error loading notifications</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications List */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {notifications.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <div className="text-6xl mb-4">🔔</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                                <p className="text-gray-600">
                                    {showUnreadOnly 
                                        ? "You're all caught up! No unread notifications."
                                        : "You haven't received any notifications yet."
                                    }
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                        !notification.isRead ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className={`text-lg font-semibold ${
                                                    !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}>
                                                        {notification.priority}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-3">{notification.message}</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">
                                                    {formatTime(notification.createdAt)}
                                                </p>
                                                {notification.issueId && (
                                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                                        Issue #{notification.issueId._id?.slice(-6)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Notification Detail Modal */}
                {selectedNotification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {selectedNotification.title}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedNotification(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(selectedNotification.priority)}`}>
                                        {selectedNotification.priority} priority
                                    </span>
                                </div>
                                <p className="text-gray-700 mb-4">{selectedNotification.message}</p>
                                <div className="text-sm text-gray-500">
                                    <p>Type: {selectedNotification.type}</p>
                                    <p>Created: {formatTime(selectedNotification.createdAt)}</p>
                                    {selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
                                        <div className="mt-2">
                                            <p className="font-medium">Additional Details:</p>
                                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                                                {JSON.stringify(selectedNotification.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
