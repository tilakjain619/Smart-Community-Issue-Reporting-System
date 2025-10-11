const { requireAuth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

const { 
  createIssue, 
  getIssues, 
  updateIssueStatus, 
  deleteIssue, 
  getAllIssues, 
  searchIssues,
  getUsersIssues
} = require('../controllers/IssueControl');

// Test route for debugging auth
router.get('/test-auth', requireAuth(), (req, res) => {
    console.log('Auth test - Session ID:', req.auth?.sessionId);
    res.json({ message: 'Auth working', sessionId: req.auth?.sessionId });
});

router.get('/issues', getIssues);
router.get('/issues/all', getAllIssues);
router.get('/issues/search', searchIssues);
router.get('/user/:userId/issues', requireAuth(), getUsersIssues);

router.post('/issues', requireAuth(), createIssue);
router.patch('/issues/:id/status', requireAuth(), updateIssueStatus);
router.delete('/issues/:id', requireAuth(), deleteIssue);

module.exports = router;