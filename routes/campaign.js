const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Get paginated/searchable campaigns
router.get('/', authMiddleware, campaignController.getCampaigns);
router.post('/filter', authMiddleware, campaignController.getCampaigns); // Optional search filter

// ✅ Create a new campaign
router.post('/', authMiddleware, campaignController.addCampaign);

// ✅ Get a single campaign by ID
router.get('/:id', authMiddleware, campaignController.getCampaignById);

// ✅ Get campaign with template and audience list details
router.get('/:id/details', authMiddleware, campaignController.getCampaignDetails);

// ✅ Update a campaign by ID
router.put('/:id', authMiddleware, campaignController.updateCampaign);

// ✅ Soft delete a campaign
router.delete('/:id', authMiddleware, campaignController.deleteCampaign);

// ✅ Toggle campaign status (Draft ↔ Published)
router.patch('/:id/status', authMiddleware, campaignController.toggleStatus);

// ✅ Copy a campaign
router.post('/:id/copy', authMiddleware, campaignController.copyCampaign);

module.exports = router;
