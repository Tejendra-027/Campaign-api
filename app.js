require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const listRoutes = require('./routes/list');
const listItemRoutes = require('./routes/listItem');

// Root route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Support both paths for list routes
app.use('/dashboard/lists', listRoutes);
app.use('/list', listRoutes);

app.use('/list/item', listItemRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API available at http://localhost:${PORT}/`);
});
