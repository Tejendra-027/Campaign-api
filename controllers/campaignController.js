const campaignService = require('../services/campaignService');

// ✅ Add new campaign
exports.addCampaign = async (req, res) => {
  try {
    const data = req.body;
    const result = await campaignService.addCampaign(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update campaign by ID
exports.updateCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await campaignService.updateCampaign(id, data);
    if (!result) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Soft delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await campaignService.deleteCampaign(id);
    if (!result) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await campaignService.getCampaignById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Toggle status
exports.toggleStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const result = await campaignService.toggleStatus(id, status);
    if (!result) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get campaigns with search + pagination
exports.getCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await campaignService.getCampaigns({ page, limit, search });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Copy campaign
exports.copyCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await campaignService.copyCampaign(id);
    if (!result) return res.status(404).json({ message: 'Original campaign not found' });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
