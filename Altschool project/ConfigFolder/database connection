const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // CHANGE THIS LINE - replace process.env.MONGODB_URI with actual string:
    const conn = await mongoose.connect('mongodb://localhost:27017/blog-api');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;