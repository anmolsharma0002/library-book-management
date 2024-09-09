const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoURI);
    console.log('MongoDB connected successfully');

    // Close the connection when the application exits
    process.on('exit', () => {
      mongoose.connection.close();
      console.log('MongoDB connection closed');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
