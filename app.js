require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Root route for browser check
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/`);
});