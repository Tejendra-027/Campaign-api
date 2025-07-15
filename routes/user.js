// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  listUsers,
  addUser,
  updateUser,
  getUserDetail,
  deleteUser,
  resetPassword
} = require('../controllers/userController');

// Filter, paginate, search users
// POST /user/filter   { page, limit, search }
router.post('/filter', authMiddleware, listUsers);

// Get single user details
// POST /user/detail   { id }
router.post('/detail', authMiddleware, getUserDetail);

// Add a user
router.post('/add', authMiddleware, addUser);

// Update user by ID
router.put('/:id', authMiddleware, updateUser);

// Delete user by ID (admin only)
router.delete('/:id', authMiddleware, deleteUser);

// Reset user password (admin only)
router.put('/reset-password/:id', authMiddleware, resetPassword);

module.exports = router;
