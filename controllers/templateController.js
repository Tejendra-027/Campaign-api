const templateService = require('../services/templateService');

// Add new template
exports.addTemplate = async (req, res) => {
    try {
        const { name, description, content } = req.body;

        if (!name || !content) {
            return res.status(400).json({ message: 'Name and content are required' });
        }

        const createdBy = req.user.id; // from JWT
        const result = await templateService.addTemplate({ name, description, content, createdBy });

        res.status(201).json({ message: 'Template created successfully', data: result });
    } catch (error) {
        console.error('Add Template Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Update existing template
exports.updateTemplate = async (req, res) => {
    try {
        const templateId = req.params.id;
        const { name, description, content } = req.body;

        const result = await templateService.updateTemplate(templateId, { name, description, content });

        res.json({ message: 'Template updated successfully', data: result });
    } catch (error) {
        console.error('Update Template Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get template by ID
exports.getTemplate = async (req, res) => {
    try {
        const templateId = req.params.id;

        const template = await templateService.getTemplateById(templateId);

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.json({ data: template });
    } catch (error) {
        console.error('Get Template Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
    try {
        const templateId = req.params.id;

        await templateService.deleteTemplate(templateId);

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete Template Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Filter templates (pagination + search)
exports.filterTemplates = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.body;

        const result = await templateService.filterTemplates({ page, limit, search });

        res.json(result);
    } catch (error) {
        console.error('Filter Templates Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Enable or disable a template
exports.updateTemplateStatus = async (req, res) => {
    try {
        const templateId = req.params.id;
        let { isActive } = req.body;

        if (typeof isActive === 'string') {
            isActive = isActive.toLowerCase() === 'true';
        }

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be true or false' });
        }

        const result = await templateService.updateTemplateStatus(templateId, isActive);

        res.json({
            message: `Template ${isActive ? 'enabled' : 'disabled'} successfully`,
            data: result
        });
    } catch (error) {
        console.error('Update Template Status Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ✅ Get all templates (id + name only) — for campaign dropdown
exports.getAllTemplatesSimple = async (req, res) => {
    try {
        const templates = await templateService.getAllTemplatesSimple();
        return res.json(templates);
    } catch (error) {
        console.error('Get All Templates Simple Error:', error);
        return res.status(500).json({ message: 'Failed to fetch templates' });
    }
};
