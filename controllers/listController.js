const listService = require('../services/listService');

// 🔍 Filter / list all entries with pagination & optional search
exports.filterLists = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const lists = await listService.filterLists({ page, limit, search });
    res.json(lists);
  } catch (err) {
    console.error('❌ Error filtering lists:', err);
    res.status(500).json({ error: 'Failed to fetch lists.' });
  }
};

// ➕ Add a new list
exports.addList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'List name is required.' });

    const id = await listService.addList({ name });
    res.status(201).json({ message: 'List added successfully.', id });
  } catch (err) {
    console.error('❌ Error adding list:', err);
    res.status(500).json({ error: 'Failed to add list.' });
  }
};

// ✏️ Update existing list by ID
exports.updateList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'List name is required.' });

    await listService.updateList(id, { name });
    res.json({ message: 'List updated successfully.' });
  } catch (err) {
    console.error('❌ Error updating list:', err);
    res.status(500).json({ error: 'Failed to update list.' });
  }
};

// 📄 Get list details by ID
exports.getListDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const list = await listService.getListDetail(id);

    if (!list) return res.status(404).json({ error: 'List not found.' });

    res.json(list);
  } catch (err) {
    console.error('❌ Error getting list detail:', err);
    res.status(500).json({ error: 'Failed to fetch list detail.' });
  }
};

// 🗑️ Delete a list (and its items) by ID
exports.deleteList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await listService.deleteList(id);

    if (!deleted) {
      return res.status(404).json({ message: 'List not found or already deleted.' });
    }

    res.json({ message: '✅ List and items deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting list:', err);
    res.status(500).json({ error: 'Failed to delete list.' });
  }
};
