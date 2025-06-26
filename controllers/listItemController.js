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
        await listItemService.uploadCsv(req.file); // You'll need to handle file upload middleware
        res.json({ message: 'CSV uploaded and processed' });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
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