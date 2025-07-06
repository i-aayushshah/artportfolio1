const mongoose = require('mongoose');

// Support both MONGODB_URI and MONGODB_URL for flexibility
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGODB_URI) {
  console.error('MongoDB connection string not found. Please set MONGODB_URI or MONGODB_URL environment variable.');
  throw new Error('Please define the MONGODB_URI or MONGODB_URL environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add additional options for better Vercel compatibility
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Removed deprecated options: bufferMaxEntries, useNewUrlParser, useUnifiedTopology
      // These are now default behavior in newer Mongoose versions
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    cached.promise = null; // Reset promise on failure
    throw error;
  }
}

module.exports = dbConnect;
