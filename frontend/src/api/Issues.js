import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

export const testAuth = async (token) => {
    try {
        console.log('Testing auth with token:', token ? 'Present' : 'Missing');
        const res = await axios.get(`${BASE_API_URL}/api/test-auth`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Auth test result:", res.data);
        return res.data;
    } catch (error) {
        console.error("Auth test failed:", error.response?.data || error.message);
        throw error;
    }
};

export const createIssue = async (newIssue, token, userId) => {
    try {
        console.log('Sending request to:', `${BASE_API_URL}/api/issues`);
        console.log('Request data:', newIssue);
        console.log('Token:', token ? 'Present' : 'Missing');

        const payload = { ...newIssue, user: userId, userId: userId }; // Add userId to payload
        const res = await axios.post(`${BASE_API_URL}/api/issues`, payload, {
            headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
        });
        console.log("Issue created:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error creating issue:", error.response?.data || error.message);
        console.error("Full error:", error);
        throw error;
    }
};
export const getUsersIssues = async (token, userId) => {
    try {
        const res = await axios.get(`${BASE_API_URL}/api/user/${userId}/issues`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching user issues:", error.response?.data || error.message);
        console.error("Full error:", error);
        throw error;
    }
};
export const getAllIssues = async (token) => {
    try {
        const res = await axios.get(`${BASE_API_URL}/api/issues/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching all issues:", error.response?.data || error.message);
        console.error("Full error:", error);
        throw error;
    }
};
export const updateIssueStatus = async (issueId, newStatus, token) => {
    try {
        const res = await axios.patch(`${BASE_API_URL}/api/issues/${issueId}/status`, {
            status: newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating issue status:", error.response?.data || error.message);
        console.error("Full error:", error);
        throw error;
    }
};

// Get issues with filtering and pagination
export const getFilteredIssues = async (filters = {}, token) => {
    try {
        const queryParams = new URLSearchParams();
        
        // Add filters to query parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                queryParams.append(key, value);
            }
        });

        const url = `${BASE_API_URL}/api/issues${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching filtered issues:", error.response?.data || error.message);
        throw error;
    }
};

// Search issues by query
export const searchIssues = async (query, token) => {
    try {
        const res = await axios.get(`${BASE_API_URL}/api/issues/search?query=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error searching issues:", error.response?.data || error.message);
        throw error;
    }
};