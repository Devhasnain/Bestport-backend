const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false; // Track the connection state

const connectDB = async () => {
  if (isConnected) {
    console.log('⚡ Using existing MongoDB connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected, retrying...');
      isConnected = false;
      setTimeout(connectDB, 3000); // Retry after 3s
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    setTimeout(connectDB, 5000); // Retry after 5s
  }
};

module.exports = connectDB;
