const express = require('express');
const router = express.Router();
const { login, register, deleteUser } = require('../controllers/authController');

// Test route to check if auth route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

// Login route
router.post('/login', login);

// Register route
router.post('/register', register);

// Delete user by ID
router.delete('/user/:id', deleteUser);

module.exports = router;
