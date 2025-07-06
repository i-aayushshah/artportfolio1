import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Check environment variables
    const hasMongoUri = !!(process.env.MONGODB_URI || process.env.MONGODB_URL);

    if (!hasMongoUri) {
      return res.status(500).json({
        success: false,
        error: 'Missing MongoDB connection string',
        details: {
          hasMongodbUri: !!process.env.MONGODB_URI,
          hasMongodbUrl: !!process.env.MONGODB_URL,
          nodeEnv: process.env.NODE_ENV,
        }
      });
    }

    // Try to connect to database
    await dbConnect();

    res.status(200).json({
      success: true,
      message: 'API and database are working correctly',
      details: {
        hasMongodbUri: !!process.env.MONGODB_URI,
        hasMongodbUrl: !!process.env.MONGODB_URL,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: {
        message: error.message,
        hasMongodbUri: !!process.env.MONGODB_URI,
        hasMongodbUrl: !!process.env.MONGODB_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
}
