const Issue = require('../models/Issue');
const analyzeImage = require('../utils/analyseImage');
const getLocation = require('../utils/getLocation');

// Create a new issue
const createIssue = async (req, res) => {
    try {
        const { userMessage, coordinates, imageUrl } = req.body;
        const userId = req.auth.userId;
        if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
            return res.status(400).json({ error: 'Valid location is required' });
        }
        if(!imageUrl){
            return res.status(400).json({ error: 'Image is required' });
        }
        // Analyze image to get category and title via AI
        const analysis = await analyzeImage(imageUrl);
        console.log(analysis);

        // Get city and state from coordinates
        const { city, state } = await getLocation(coordinates.latitude, coordinates.longitude);
        console.log(city, state);
        

        const newIssue = await Issue.create({
            userId,
            userMessage: userMessage || '',
            category: analysis.category || 'Unknown',
            title: analysis.title || "Unknown Issue",
            coordinates,
            city: city,
            state: state,
            imageUrl: imageUrl || ''
        });

        res.status(201).json(newIssue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateIssueStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['open', 'in progress', 'pending', 'closed', 'resolved'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        issue.status = status;
        await issue.save();
        res.status(200).json(issue);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createIssue, getIssues, updateIssueStatus };