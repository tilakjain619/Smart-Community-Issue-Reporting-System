const { logAction } = require('../controllers/logControl');

// Middleware to automatically log actions
const autoLogger = (action, options = {}) => {
    return async (req, res, next) => {
        // Store original json method
        const originalJson = res.json;
        
        // Override json method to log after successful response
        res.json = function(data) {
            // Only log if response is successful (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Extract user info from request (adjust based on your auth system)
                const userId = req.body.userId || req.user?.userId || req.params.userId || 'anonymous';
                const userType = req.user?.userType || options.defaultUserType || 'user';
                
                // Extract issue ID if available
                let issueId = req.body.issueId || req.params.id || req.params.issueId;
                if (data && data._id) issueId = data._id;
                if (data && data.issue && data.issue._id) issueId = data.issue._id;

                // Determine severity based on action type
                let severity = options.severity || 'info';
                if (action.toLowerCase().includes('delete')) severity = 'warning';
                if (action.toLowerCase().includes('error') || action.toLowerCase().includes('fail')) severity = 'critical';

                // Create detailed log entry
                const logData = {
                    userType,
                    userId,
                    action: options.customAction || action,
                    issueId,
                    details: options.details || `${action} - Status: ${res.statusCode}`,
                    severity,
                    req // Pass request object for IP and device extraction
                };

                // Log asynchronously to avoid blocking response
                logAction(logData).catch(error => {
                    console.error('Failed to log action:', error);
                });
            }

            // Call original json method
            return originalJson.call(this, data);
        };

        next();
    };
};

// Specific loggers for common actions
const logIssueCreation = autoLogger('Create Issue', { 
    severity: 'info',
    details: 'New issue reported by user'
});

const logIssueUpdate = autoLogger('Update Issue Status', { 
    severity: 'info',
    details: 'Issue status updated'
});

const logIssueDelete = autoLogger('Delete Issue', { 
    severity: 'warning',
    details: 'Issue deleted from system'
});

const logUserLogin = autoLogger('User Login', { 
    severity: 'info',
    details: 'User authenticated successfully'
});

const logUserLogout = autoLogger('User Logout', { 
    severity: 'info',
    details: 'User logged out'
});

const logVoteAction = autoLogger('Vote on Issue', { 
    severity: 'info',
    details: 'User voted on issue'
});

const logAdminAction = autoLogger('Admin Action', { 
    severity: 'warning',
    defaultUserType: 'admin',
    details: 'Administrative action performed'
});

const logCriticalError = autoLogger('System Error', { 
    severity: 'critical',
    details: 'Critical system error occurred'
});

// Custom logger for specific use cases
const logCustomAction = (actionName, details, severity = 'info') => {
    return autoLogger(actionName, { 
        details,
        severity,
        customAction: actionName
    });
};

module.exports = {
    autoLogger,
    logIssueCreation,
    logIssueUpdate,
    logIssueDelete,
    logUserLogin,
    logUserLogout,
    logVoteAction,
    logAdminAction,
    logCriticalError,
    logCustomAction
};