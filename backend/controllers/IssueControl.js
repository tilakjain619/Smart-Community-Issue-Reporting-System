const Issue = require('../models/Issue');
const analyzeImage = require('../utils/analyseImage');
const getLocation = require('../utils/getLocation');

// Create a new issue
const createIssue = async (req, res) => {
    try {
        const { userMessage, coordinates, imageUrl } = req.body;
        const userId = req.auth?.userId;
        
        if (!userId) {
            console.log('No user ID found in auth');
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
            console.log('Invalid coordinates:', coordinates);
            return res.status(400).json({ error: 'Valid location is required' });
        }
        
        if(!imageUrl){
            console.log('No image URL provided');
            return res.status(400).json({ error: 'Image is required' });
        }
        
        // Analyze image to get category and title via AI
        const analysis = await analyzeImage(imageUrl);
        // Get city and state from coordinates
        const { city, state } = await getLocation(coordinates.latitude, coordinates.longitude);
        console.log('💾 Creating issue in database...');
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
        console.error('Error creating issue:', error.message);
        res.status(500).json({ error: error.message });
    }
}

const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUsersIssues = async (req, res) => {
    try {
        const { userId } = req.params;
        const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getIssues = async (req, res) => {
    try {
    const {
      page = 1,
      limit = 10,
      status,
      city,
      state,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build dynamic filter object
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = { $regex: city, $options: "i" }; // case-insensitive
    if (state) filter.state = { $regex: state, $options: "i" };

    // Sorting logic
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // Pagination
    const skip = (page - 1) * limit;

    const issues = await Issue.find(filter, { __v: 0 })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination info
    const total = await Issue.countDocuments(filter);

    // structured response
    res.status(200).json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      count: issues.length,
      issues,
    });
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
const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchIssues = async (req, res) => {
    try {
        const { query } = req.query;
        const issues = await Issue.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { city: { $regex: query, $options: 'i' } },
                { state: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createIssue, getIssues, updateIssueStatus, deleteIssue, getAllIssues, searchIssues, getUsersIssues };