import axios from "axios";
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

// Get all officers
export const getOfficers = async (token, filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.email) params.append('email', filters.email);
        if (filters.location) params.append('location', filters.location);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.date) params.append('date', filters.date);

        const url = `${BASE_API_URL}/api/officers${params.toString() ? `?${params.toString()}` : ''}`;
        
        const res = await axios.get(url, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data.officers;
    } catch (error) {
        console.error("Error fetching officers:", error.response?.data || error.message);
        throw error;
    }
};

// Create new officer
export const createOfficer = async (officerData, token) => {
    try {
        const res = await axios.post(`${BASE_API_URL}/api/officers`, officerData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error creating officer:", error.response?.data || error.message);
        throw error;
    }
};

// Update officer
export const updateOfficer = async (officerId, officerData, token) => {
    try {
        const res = await axios.put(`${BASE_API_URL}/api/officers/${officerId}`, officerData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating officer:", error.response?.data || error.message);
        throw error;
    }
};

// Delete officer
export const deleteOfficer = async (officerId, token) => {
    try {
        const res = await axios.delete(`${BASE_API_URL}/api/officers/${officerId}`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting officer:", error.response?.data || error.message);
        throw error;
    }
};