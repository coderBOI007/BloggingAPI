const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./ConfigFolder/database-connection.js');
const authRoutes = require('./Route/auth.routes.js');
const blogRoutes = require('./Route/blog.routes.js');
const errorHandler = require('./Middleware/error.middleware.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Blogging API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      blogs: '/api/blogs'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

module.exports = app;

// Test route to check if controller files are accessible
app.get('/test', (req, res) => {
  try {
    const authController = require('./controller/auth.controller.js');
    res.json({ 
      success: true, 
      message: 'Controller files are accessible',
      authController: typeof authController
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Controller files not accessible',
      error: error.message 
    });
  }
});
