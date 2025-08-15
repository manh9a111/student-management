const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/students';

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URI, {
    autoIndex: true,
  });
  console.log('[DB] connected');
}

module.exports = connectDB;
