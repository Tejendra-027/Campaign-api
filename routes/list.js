const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware'); // 🔐 protect routes

/* ------------------------------------------------------------------
   LIST ROUTES
------------------------------------------------------------------- */

// Filter / paginate / search  (now POST with JSON body)
router.post('/filter', authMiddleware, listController.filterLists);

// Get single list by ID (converted from GET /:id)
router.post('/detail', authMiddleware, listController.getListDetail);

// Add a new list
router.post('/', authMiddleware, listController.addList);

// Update a list
router.put('/:id', authMiddleware, listController.updateList);

// Delete a list (manual cascade in controller)
router.delete('/:id', authMiddleware, listController.deleteList);

router.get('/all', authMiddleware, listController.getAllListsSimple);


module.exports = router;
