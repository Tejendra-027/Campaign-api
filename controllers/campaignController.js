const db = require('../models/db');
const campaignService = require('../services/campaignService');

// ✅ Add new campaign
exports.addCampaign = async (req, res) => {
  try {
    const data = req.body;
    const result = await campaignService.addCampaign(data);
    res.status(201).json(result);
  } catch (err) {
    console.error('Add campaign error:', err);
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
    console.error('Update campaign error:', err);
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
    console.error('Delete campaign error:', err);
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
    console.error('Get campaign by ID error:', err);
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
    console.error('Toggle status error:', err);
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
    console.error('Get campaigns error:', err);
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
    console.error('Copy campaign error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get campaign with template and audience list details
exports.getCampaignDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const sql = `
      SELECT 
        c.*, 
        t.name AS templateName, t.content AS templateContent,
        l.name AS audienceListName
      FROM campaigns c
      LEFT JOIN templates t ON c.templateId = t.id
      LEFT JOIN list l ON c.audienceListId = l.id
      WHERE c.id = ? AND c.isDeleted = FALSE
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error('Main query error:', err);
        return res.status(500).json({ error: err.message });
      }

      if (!rows.length) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      const campaign = rows[0];
      const listId = campaign.audienceListId;

      db.query(
        'SELECT email, name FROM list_item WHERE listId = ?',
        [listId],
        (listErr, listRows) => {
          if (listErr) {
            console.error('List items query error:', listErr);
            return res.status(500).json({ error: listErr.message });
          }

          res.json({
            template: {
              name: campaign.templateName,
              content: campaign.templateContent,
            },
            list: listRows || [],
          });
        }
      );
    });
  } catch (err) {
    console.error('Catch block error in getCampaignDetails:', err);
    res.status(500).json({ error: err.message });
  }
};
