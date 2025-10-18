const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userType: { type: String, enum: ['admin', 'officer', 'user'], required: true },
    userId: { type: String, required: true },
    action: { type: String, required: true, trim: true },
    issueId: { type: String },
    details: { type: String, trim: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    ipAddress: { type: String },
    deviceInfo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);