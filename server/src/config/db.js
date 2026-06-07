const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected — retrying in 5s...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
