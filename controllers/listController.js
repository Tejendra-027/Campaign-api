const listService = require('../services/listService');

/* ------------------------------------------------------------------ */
/* 1. Filter / paginate / search  – POST body                        */
/* ------------------------------------------------------------------ */
exports.filterLists = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.body;
    const lists = await listService.filterLists({ page, limit, search });
    return res.json(lists);
  } catch (err) {
    console.error('filterLists:', err);
    return res.status(500).json({ error: 'Failed to fetch lists.' });
  }
};

/* ------------------------------------------------------------------ */
/* 2. Add list                                                       */
/* ------------------------------------------------------------------ */
exports.addList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'List name is required.' });

    const id = await listService.addList({ name });
    return res.status(201).json({ message: 'List added successfully.', id });
  } catch (err) {
    console.error('addList:', err);
    return res.status(500).json({ error: 'Failed to add list.' });
  }
};

/* ------------------------------------------------------------------ */
/* 3. Update list (PUT /:id)                                         */
/* ------------------------------------------------------------------ */
exports.updateList = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'List name is required.' });

    await listService.updateList(id, { name });
    return res.json({ message: 'List updated successfully.' });
  } catch (err) {
    console.error('updateList:', err);
    return res.status(500).json({ error: 'Failed to update list.' });
  }
};

/* ------------------------------------------------------------------ */
/* 4. Get list detail – POST /detail (id in body)                    */
/* ------------------------------------------------------------------ */
exports.getListDetail = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'List ID is required.' });

    const list = await listService.getListDetail(Number(id));
    if (!list) return res.status(404).json({ error: 'List not found.' });

    return res.json(list);
  } catch (err) {
    console.error('getListDetail:', err);
    return res.status(500).json({ error: 'Failed to fetch list detail.' });
  }
};

/* ------------------------------------------------------------------ */
/* 5. Delete list (and items) – DELETE /:id                          */
/* ------------------------------------------------------------------ */
exports.deleteList = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await listService.deleteList(id);

    if (!deleted) {
      return res.status(404).json({ message: 'List not found or already deleted.' });
    }
    return res.json({ message: 'List and items deleted successfully.' });
  } catch (err) {
    console.error('deleteList:', err);
    return res.status(500).json({ error: 'Failed to delete list.' });
  }
};

/* ------------------------------------------------------------------ */
/* ✅ 6. Get all lists (ID + name only) – GET /all (for Campaign UI) */
/* ------------------------------------------------------------------ */
exports.getAllListsSimple = async (req, res) => {
  try {
    const lists = await listService.getAllListsSimple();
    return res.json(lists);
  } catch (err) {
    console.error('getAllListsSimple:', err);
    return res.status(500).json({ error: 'Failed to fetch lists.' });
  }
};
