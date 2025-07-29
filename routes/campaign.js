const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET route for paginated/searchable campaigns (used by React frontend)
router.get('/', authMiddleware, campaignController.getCampaigns);

// Optional: also support POST /filter for manual requests (optional)
router.post('/filter', authMiddleware, campaignController.getCampaigns);

// ✅ Create a new campaign
router.post('/', authMiddleware, campaignController.addCampaign);

// ✅ Get a single campaign by ID
router.get('/:id', authMiddleware, campaignController.getCampaignById);

// ✅ Update a campaign by ID
router.put('/:id', authMiddleware, campaignController.updateCampaign);

// ✅ Soft delete a campaign
router.delete('/:id', authMiddleware, campaignController.deleteCampaign);

// ✅ Toggle campaign status
router.patch('/:id/status', authMiddleware, campaignController.toggleStatus);

// ✅ Copy a campaign
router.post('/:id/copy', authMiddleware, campaignController.copyCampaign);

module.exports = router;
