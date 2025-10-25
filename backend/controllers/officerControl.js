const Officer = require('../models/Officer');
const Issue = require('../models/Issue');
const { notifyOfficerAssignment } = require('../utils/notificationUtils');

const createOfficer = async (req, res) => {
    try {
        const { fullName, email, role, assignedCategories, assignedLocations, phone } = req.body;
        const newOfficer = new Officer({
            fullName,
            email,
            role,
            assignedCategories,
            assignedLocations,
            phone
        });
        if(await Officer.findOne({ email: email })){
            return res.status(400).json({ message: 'Officer with this email already exists' });
        }
        await newOfficer.save();
        res.status(201).json({ message: 'Officer created successfully', officer: newOfficer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating officer', error });
    }
};

const getOfficers = async (req, res) => {
    try {
        const { email, location, startDate, endDate, date } = req.query;
        const query = {};

        // Email filter (partial, case-insensitive)
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        // Location filter (matches any element in assignedLocations, case-insensitive)
        if (location) {
            query.assignedLocations = { $in: [new RegExp(location, 'i')] };
        }

        // Date of joining filter: support a single date (date) or a range (startDate, endDate).
        // Use `dateOfJoining` field if present in the schema, otherwise fall back to `createdAt`.
        const dateField = 'createdAt';
        const dateFilter = {};

        if (startDate) {
            const sd = new Date(startDate);
            if (!isNaN(sd)) dateFilter.$gte = sd;
        }
        if (endDate) {
            const ed = new Date(endDate);
            if (!isNaN(ed)) dateFilter.$lte = ed;
        }
        if (date) {
            const d = new Date(date);
            if (!isNaN(d)) {
                const dayStart = new Date(d);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(d);
                dayEnd.setHours(23, 59, 59, 999);
                dateFilter.$gte = dayStart;
                dateFilter.$lte = dayEnd;
            }
        }
        if (Object.keys(dateFilter).length) {
            query[dateField] = dateFilter;
        }

        // If no filters provided, query will be empty and return all officers (default behavior).
        const officers = await Officer.find(query);
        res.status(200).json({ message: 'Officers retrieved successfully', officers });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving officers', error });
    }
};

const updateOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedOfficer = await Officer.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedOfficer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        res.status(200).json({ message: 'Officer updated successfully', officer: updatedOfficer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating officer', error });
    }
};

const deleteOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOfficer = await Officer.findByIdAndDelete(id);
        if (!deletedOfficer) {
            return res.status(404).json({ message: 'Officer not found' });
        }
        res.status(200).json({ message: 'Officer deleted successfully', officer: deletedOfficer });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting officer', error });
    }
};

// Assign an officer to an issue
const assignOfficerToIssue = async (req, res) => {
    try {
        const { issueId, officerId } = req.body;
        
        if (!issueId || !officerId) {
            return res.status(400).json({ message: 'Issue ID and Officer ID are required' });
        }

        // Check if issue exists
        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if officer exists
        const officer = await Officer.findById(officerId);
        if (!officer) {
            return res.status(404).json({ message: 'Officer not found' });
        }

        // Update issue with assigned officer
        issue.assignedOfficer = officerId;
        await issue.save();

        // Send notification about officer assignment
        await notifyOfficerAssignment(issue, officerId);

        res.status(200).json({ 
            message: 'Officer assigned to issue successfully', 
            issue,
            officer: {
                id: officer._id,
                name: officer.fullName,
                email: officer.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning officer to issue', error });
    }
};

module.exports = {
    createOfficer,
    getOfficers,
    updateOfficer,
    deleteOfficer,
    assignOfficerToIssue
};
