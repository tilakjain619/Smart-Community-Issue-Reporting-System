const { createIssue, getIssues, updateIssueStatus } = require('../controllers/IssueControl');
const { requireAuth } = require("@clerk/clerk-sdk-node");

const router = require('express').Router();
router.post('/issues', requireAuth(), createIssue);
router.get('/issues', getIssues);
router.patch('/issues/:id/status', requireAuth(), updateIssueStatus);

module.exports = router;