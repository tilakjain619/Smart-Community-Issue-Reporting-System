const { requireAuth } = require('@clerk/express');
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

router.get('/issues', getIssues);
router.get('/issues/all', getAllIssues);
router.get('/issues/search', searchIssues);

router.post('/issues', requireAuth(), createIssue);
router.get('/users/:userId/issues', requireAuth(), getUsersIssues);
router.patch('/issues/:id/status', requireAuth(), updateIssueStatus);
router.delete('/issues/:id', requireAuth(), deleteIssue);

module.exports = router;
