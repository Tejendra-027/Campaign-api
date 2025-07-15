// routes/listItem.js
const express          = require('express');
const router           = express.Router();
const listItemController = require('../controllers/listItemController');
const authMiddleware   = require('../middleware/authMiddleware');
const multer           = require('multer');
const upload           = multer({ dest: 'uploads/' });

/* ─────────────── LIST‑ITEM ROUTES ─────────────── */

// 🔍 Filter / paginate / search — POST body instead of GET query
router.post('/filter', authMiddleware, listItemController.filterListItems);

// ➕ Create a new item
router.post('/add', authMiddleware, listItemController.addListItem);

// 📤 CSV upload (unchanged)
router.post('/upload', authMiddleware, upload.single('file'), listItemController.uploadCsv);

// ✏️ Update item
router.put('/:id', authMiddleware, listItemController.updateListItem);

// 📄 Get single item detail  ▸ converted from GET /:id
router.post('/detail', authMiddleware, listItemController.getListItemDetail);

// 🗑️ Delete item
router.delete('/:id', authMiddleware, listItemController.deleteListItem);

module.exports = router;
