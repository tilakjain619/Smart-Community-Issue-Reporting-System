import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

// Get notifications for a specific user
export const getUserNotifications = async (userId, token, page = 1, limit = 20, unreadOnly = false) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (unreadOnly) {
            queryParams.append('unreadOnly', 'true');
        }

        const url = `${BASE_API_URL}/api/notifications/user/${userId}?${queryParams.toString()}`;
        
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching user notifications:", error.response?.data || error.message);
        throw error;
    }
};

// Get unread notification count for a user
export const getUnreadCount = async (userId, token) => {
    try {
        const res = await axios.get(`${BASE_API_URL}/api/notifications/user/${userId}/unread-count`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching unread count:", error.response?.data || error.message);
        throw error;
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId, token) => {
    try {
        const res = await axios.patch(`${BASE_API_URL}/api/notifications/${notificationId}/read`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error marking notification as read:", error.response?.data || error.message);
        throw error;
    }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId, token) => {
    try {
        const res = await axios.patch(`${BASE_API_URL}/api/notifications/user/${userId}/mark-all-read`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a notification
export const deleteNotification = async (notificationId, token) => {
    try {
        const res = await axios.delete(`${BASE_API_URL}/api/notifications/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting notification:", error.response?.data || error.message);
        throw error;
    }
};

// Get notification statistics (admin only)
export const getNotificationStats = async (token) => {
    try {
        const res = await axios.get(`${BASE_API_URL}/api/notifications/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching notification stats:", error.response?.data || error.message);
        throw error;
    }
};
