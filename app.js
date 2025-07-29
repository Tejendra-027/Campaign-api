require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// ✅ Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const listRoutes = require('./routes/list');
const listItemRoutes = require('./routes/listItem');
const templateRoutes = require('./routes/template');
const campaignRoutes = require('./routes/campaign');

// ✅ Register routes

// Auth & Users
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// ✅ Lists
app.use('/list', listRoutes);               // legacy
app.use('/api/list', listRoutes);          // preferred

// ✅ Templates
app.use('/templates', templateRoutes);           // legacy
app.use('/api/templates', templateRoutes);       // preferred

// ✅ List Items
app.use('/list/item', listItemRoutes);

// ✅ Campaigns
app.use('/api/campaign', campaignRoutes);  // used by frontend: /api/campaign

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/`);
});
