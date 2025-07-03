const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// GET all lists with optional filters (search, pagination)
router.get('/', listController.filterLists);

// GET single list by ID
router.get('/:id', listController.getListDetail);

// POST a new list
router.post('/', listController.addList);

// PUT (update) a list by ID
router.put('/:id', listController.updateList);

// DELETE a list by ID
router.delete('/:id', listController.deleteList); // ✅ DELETE /dashboard/lists/:id

module.exports = router;
