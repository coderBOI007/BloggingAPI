const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./ConfigFolder/database connection');
const authRoutes = require('./Route/auth.routes');
const blogRoutes = require('./Route/blog.routes');
const errorHandler = require('./Middleware/error.middleware');

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
