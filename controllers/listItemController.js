const listItemService = require('../services/listItemService');

exports.filterListItems = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', listId } = req.query;
        const items = await listItemService.filterListItems({ page, limit, search, listId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.addListItem = async (req, res) => {
    try {
        const id = await listItemService.addListItem(req.body);
        res.json({ message: 'List item added', id });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.uploadCsv = async (req, res) => {
    try {
        const result = await listItemService.uploadCsv(req.file);
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateListItem = async (req, res) => {
    try {
        const id = req.params.id;
        await listItemService.updateListItem(id, req.body);
        res.json({ message: 'List item updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.getListItemDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await listItemService.getListItemDetail(id);
        if (!item) return res.status(404).json({ message: 'List item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};