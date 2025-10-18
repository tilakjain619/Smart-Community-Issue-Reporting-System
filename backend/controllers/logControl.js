const Log = require('../models/Log');

// Create a new log entry
const createLog = async (req, res) => {
    try {
        const log = new Log({
            userType: req.body.userType,
            userId: req.body.userId,
            action: req.body.action,
            issueId: req.body.issueId,
            details: req.body.details,
            severity: req.body.severity,
            ipAddress: req.body.ipAddress,
            deviceInfo: req.body.deviceInfo,
        });
        await log.save();
        res.status(201).send(log);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all logs with filtering and pagination
const getLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            userType,
            action,
            severity,
            userId,
            startDate,
            endDate,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (userType) filter.userType = userType;
        if (action) filter.action = { $regex: action, $options: 'i' };
        if (severity) filter.severity = severity;
        if (userId) filter.userId = userId;
        
        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Sorting
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        // Pagination
        const skip = (page - 1) * limit;

        const logs = await Log.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Log.countDocuments(filter);

        res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            count: logs.length,
            logs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get log statistics
const getLogStats = async (req, res) => {
    try {
        const stats = await Log.aggregate([
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 }
                }
            }
        ]);

        const actionStats = await Log.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const userTypeStats = await Log.aggregate([
            {
                $group: {
                    _id: '$userType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentActivity = await Log.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('action userType userId createdAt severity');

        res.status(200).json({
            severityStats: stats,
            topActions: actionStats,
            userTypeStats,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Helper function to create log entries programmatically
const logAction = async (data) => {
    try {
        const {
            userType = 'user',
            userId,
            action,
            issueId,
            details,
            severity = 'info',
            ipAddress,
            deviceInfo,
            req // Express request object for extracting IP and user agent
        } = data;

        // Extract IP and device info from request if provided
        let extractedIP = ipAddress;
        let extractedDevice = deviceInfo;

        if (req) {
            extractedIP = extractedIP || req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
            extractedDevice = extractedDevice || req.headers['user-agent'];
        }

        const log = new Log({
            userType,
            userId,
            action,
            issueId,
            details,
            severity,
            ipAddress: extractedIP,
            deviceInfo: extractedDevice
        });

        await log.save();
        console.log(`📝 Logged action: ${action} by ${userType} ${userId}`);
        return log;
    } catch (error) {
        console.error('Error creating log:', error.message);
        // Don't throw error to avoid breaking main functionality
        return null;
    }
};

// Delete old logs (cleanup utility)
const cleanupLogs = async (req, res) => {
    try {
        const { days = 90 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const result = await Log.deleteMany({
            createdAt: { $lt: cutoffDate },
            severity: { $ne: 'critical' } // Keep critical logs longer
        });

        res.status(200).json({
            message: `Deleted ${result.deletedCount} log entries older than ${days} days`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLog,
    getLogs,
    getLogStats,
    logAction,
    cleanupLogs
};