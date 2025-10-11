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