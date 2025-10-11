const { users } = require('../lib/appwrite');

const requireAuth = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const sessionId = authHeader.substring(7); // Remove 'Bearer ' prefix
            
            // For Appwrite, we need to verify the session differently
            // Since we're using session ID as token, we need to validate it
            // This is a simplified approach - in production, you might want to use JWT
            
            if (!sessionId) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Store session info in request
            req.auth = {
                sessionId: sessionId,
                // We'll need to get user info from the session
                // For now, we'll extract user ID from the session in the controller
            };

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ error: 'Authentication failed' });
        }
    };
};

// Helper function to get user from session
const getUserFromSession = async (sessionId) => {
    try {
        // In a real implementation, you'd verify the session with Appwrite
        // For now, we'll use a simplified approach
        return { userId: sessionId }; // Placeholder
    } catch (error) {
        throw new Error('Invalid session');
    }
};

module.exports = { requireAuth, getUserFromSession };