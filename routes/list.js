const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/filter', authMiddleware, listController.filterLists);
router.post('/add', authMiddleware, listController.addList);
router.put('/add/:id', authMiddleware, listController.updateList);
router.get('/:id', authMiddleware, listController.getListDetail);

module.exports = router;