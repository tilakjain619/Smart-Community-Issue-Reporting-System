const { requireAuth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { createOfficer, getOfficers, updateOfficer, deleteOfficer, assignOfficerToIssue } = require('../controllers/officerControl');

router.post('/officers', requireAuth(), createOfficer);
router.get('/officers', requireAuth(), getOfficers);
router.put('/officers/:id', requireAuth(), updateOfficer);
router.delete('/officers/:id', requireAuth(), deleteOfficer);
router.post('/officers/assign', requireAuth(), assignOfficerToIssue);

module.exports = router;