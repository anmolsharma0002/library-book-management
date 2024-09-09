const mongoose = require('mongoose');
const env = require('./env');

/**
 * Connects to MongoDB and handles connection events.
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(env.mongoURI);

    console.log('MongoDB connected successfully');

    // Handle graceful shutdown on application exit
    process.on('SIGINT', async () => {
      await mongoose.connection.close(); // Close the connection gracefully
      console.log('MongoDB connection closed due to application termination (SIGINT)');
      process.exit(0); // Exit the process with a success code
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close(); // Close the connection gracefully
      console.log('MongoDB connection closed due to application termination (SIGTERM)');
      process.exit(0); // Exit the process with a success code
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err); // Log connection errors
    process.exit(1); // Exit the process with an error code
  }
};

module.exports = connectDB;
