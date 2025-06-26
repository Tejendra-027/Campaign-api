const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { listUsers, addUser, updateUser, getUserDetail, deleteUser } = require('../controllers/userController');

// List all users (protected)
router.get('/list', authMiddleware, listUsers);

// Add a user (protected)
router.post('/add', authMiddleware, addUser);

// Update user by ID (protected)
router.put('/:id', authMiddleware, updateUser);

// Get user by ID (protected)
router.get('/:id', authMiddleware, getUserDetail);

// Delete user by ID (admin only, protected)
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;