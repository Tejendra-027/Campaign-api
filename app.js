require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const listRoutes = require('./routes/list');
const listItemRoutes = require('./routes/listItem');

// Health check route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Register routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Support both dashboard and base paths for list routes
app.use('/dashboard/lists', listRoutes);
app.use('/list', listRoutes); // Enables /list endpoints

// List item routes
app.use('/list/item', listItemRoutes); //  Handles /list/item/:id, etc.

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API available at http://localhost:${PORT}/`);
});
