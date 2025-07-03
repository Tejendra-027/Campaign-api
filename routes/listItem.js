const express = require('express');
const router = express.Router();
const listItemController = require('../controllers/listItemController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// List item routes
router.get('/filter', authMiddleware, listItemController.filterListItems);
router.post('/add', authMiddleware, listItemController.addListItem);
router.post('/upload', authMiddleware, upload.single('file'), listItemController.uploadCsv);
router.put('/add/:id', authMiddleware, listItemController.updateListItem);
router.get('/:id', authMiddleware, listItemController.getListItemDetail);

// ✅ NEW: Delete list item
router.delete('/:id', authMiddleware, listItemController.deleteListItem);

module.exports = router;
