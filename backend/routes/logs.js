const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

const { 
    createLog, 
    getLogs, 
    getLogStats, 
    cleanupLogs 
} = require('../controllers/logControl');

// Create a new log entry (manual)
router.post('/logs', requireAuth(), createLog);

// Get all logs with filtering (admin only)
router.get('/logs', requireAuth(), getLogs);

// Get log statistics (admin only)
router.get('/logs/stats', requireAuth(), getLogStats);

// Cleanup old logs (admin only)
router.delete('/logs/cleanup', requireAuth(), cleanupLogs);

module.exports = router;