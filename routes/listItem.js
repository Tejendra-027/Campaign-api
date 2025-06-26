const express = require('express');
const router = express.Router();
const listItemController = require('../controllers/listItemController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/filter', authMiddleware, listItemController.filterListItems);
router.post('/add', authMiddleware, listItemController.addListItem);
router.post('/upload', authMiddleware, listItemController.uploadCsv);
router.put('/add/:id', authMiddleware, listItemController.updateListItem);
router.get('/:id', authMiddleware, listItemController.getListItemDetail);

module.exports = router;