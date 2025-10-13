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
  getUsersIssues,
  voteIssue
} = require('../controllers/IssueControl');

router.get('/issues', getIssues);
router.get('/issues/all', getAllIssues);
router.get('/issues/search', searchIssues);
router.get('/user/:userId/issues', requireAuth(), getUsersIssues);

router.post('/issues', requireAuth(), createIssue);
router.patch('/issues/:id/status', requireAuth(), updateIssueStatus);
router.delete('/issues/:id', requireAuth(), deleteIssue);
router.post('/issues/:id/vote', requireAuth(), voteIssue);

module.exports = router;