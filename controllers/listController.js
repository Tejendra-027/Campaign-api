const listService = require('../services/listService');

exports.filterLists = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const lists = await listService.filterLists({ page, limit, search });
        res.json(lists);
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.addList = async (req, res) => {
    try {
        const { name } = req.body;
        const id = await listService.addList({ name });
        res.json({ message: 'List added', id });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.updateList = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        await listService.updateList(id, { name });
        res.json({ message: 'List updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};

exports.getListDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const list = await listService.getListDetail(id);
        if (!list) return res.status(404).json({ message: 'List not found' });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
};