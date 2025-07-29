const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');

// These will now map to: /templates (because of server.js base path)

// Create new template → POST /templates
router.post('/', authMiddleware, templateController.addTemplate);

// Update existing template by ID → PUT /templates/:id
router.put('/:id', authMiddleware, templateController.updateTemplate);

// Get a single template by ID → GET /templates/:id
router.get('/:id', authMiddleware, templateController.getTemplate);

// Delete a template by ID → DELETE /templates/:id
router.delete('/:id', authMiddleware, templateController.deleteTemplate);

// Filter/paginate/search templates → POST /templates/filter
router.post('/filter', authMiddleware, templateController.filterTemplates);

// Update template status → PUT /templates/:id/status
router.put('/:id/status', authMiddleware, templateController.updateTemplateStatus);

// Get all templates (id + name only) – for campaign dropdown
router.get('/all', authMiddleware, templateController.getAllTemplatesSimple);


module.exports = router;
