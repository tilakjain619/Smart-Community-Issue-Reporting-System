import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserNotifications, getUnreadCount, markNotificationAsRead, markAllNotificationsAsRead } from '../api/Notifications';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications for the current user
    const fetchNotifications = async (page = 1, limit = 20, unreadOnly = false) => {
        if (!user || !token) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getUserNotifications(user.$id, token, page, limit, unreadOnly);
            setNotifications(response.notifications);
            setUnreadCount(response.unreadCount);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        if (!user || !token) return;

        try {
            const response = await getUnreadCount(user.$id, token);
            setUnreadCount(response.unreadCount);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        if (!token) return;

        try {
            await markNotificationAsRead(notificationId, token);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        if (!user || !token) return;

        try {
            await markAllNotificationsAsRead(user.$id, token);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Refresh notifications
    const refreshNotifications = () => {
        fetchNotifications();
    };

    // Auto-refresh unread count every 30 seconds
    useEffect(() => {
        if (!user || !token) return;

        fetchUnreadCount();
        
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user, token, fetchUnreadCount]);

    // Initial fetch when user logs in
    useEffect(() => {
        if (user && token) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, token, fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
