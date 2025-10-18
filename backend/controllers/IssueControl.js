const Issue = require('../models/Issue');
const analyzeImage = require('../utils/analyseImage');
const getLocation = require('../utils/getLocation');
const { logAction } = require('./logControl');

// Create a new issue
const createIssue = async (req, res) => {
    try {
        console.log('📝 Create issue request received');
        console.log('Request body:', req.body);
        
        const { userId, userMessage, coordinates, imageUrl } = req.body;

        console.log("userId:", userId);
        
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

        // Log the issue creation
        await logAction({
            userType: 'user',
            userId: userId,
            action: 'Create Issue',
            issueId: newIssue._id,
            details: `New issue "${newIssue.title}" reported in ${city}, ${state}`,
            severity: 'info',
            req
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
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
        if (!issues || issues.length === 0) {
            return res.status(404).json({ message: 'No issues found for this user' });
        }
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
        
        const previousStatus = issue.status;
        issue.status = status;
        await issue.save();

        // Log the status update
        await logAction({
            userType: 'admin', // Assume admin is updating status
            userId: req.body.userId || 'system',
            action: 'Update Issue Status',
            issueId: id,
            details: `Issue status changed from "${previousStatus}" to "${status}"`,
            severity: status === 'resolved' ? 'info' : 'warning',
            req
        });

        res.status(200).json(issue);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        // Store issue details before deletion for logging
        const issueTitle = issue.title;
        const issueCity = issue.city;
        
        await Issue.findByIdAndDelete(id);

        // Log the deletion
        await logAction({
            userType: 'admin',
            userId: req.body.userId || 'system',
            action: 'Delete Issue',
            issueId: id,
            details: `Issue "${issueTitle}" deleted from ${issueCity}`,
            severity: 'warning',
            req
        });

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
const voteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        if (!issue.voters) issue.voters = [];
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required to vote' });
        }
        
        let voteAction;
        if (issue.voters.includes(userId)) {
            issue.votes = Math.max(0, issue.votes - 1);
            issue.voters = issue.voters.filter(voter => voter !== userId);
            voteAction = 'removed vote from';
        } else {
            issue.votes = (issue.votes || 0) + 1;
            issue.voters.push(userId);
            voteAction = 'voted on';
        }
        
        await issue.save();

        // Log the vote action
        await logAction({
            userType: 'user',
            userId: userId,
            action: 'Vote on Issue',
            issueId: id,
            details: `User ${voteAction} issue "${issue.title}" (Total votes: ${issue.votes})`,
            severity: 'info',
            req
        });

        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createIssue, getIssues, updateIssueStatus, deleteIssue, getAllIssues, searchIssues, getUsersIssues, voteIssue };