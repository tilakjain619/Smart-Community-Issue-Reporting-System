const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['officer', 'supervisor'],
        default: 'officer'
    },
    assignedCategories: [{
        type: String,
    }],
    assignedLocations: [{
        type: String,
    }],
    phone: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Officer', OfficerSchema);
