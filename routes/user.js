const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listUsers, addUser, updateUser, getUserDetail } = require('../controllers/userController');

router.get('/list', authMiddleware, listUsers);
router.post('/add', authMiddleware, addUser);
router.put('/add/:id', authMiddleware, updateUser);
router.get('/:id', authMiddleware, getUserDetail);

module.exports = router;
