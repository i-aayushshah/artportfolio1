const dbConnect = require('../../lib/mongodb');
import Subscriber from '../../models/Subscriber';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({
          success: false,
          message: 'Email and token are required'
        });
      }

      // Simple token validation (email encoded in base64)
      const decodedEmail = Buffer.from(token, 'base64').toString();

      if (decodedEmail !== email) {
        return res.status(400).json({
          success: false,
          message: 'Invalid unsubscribe token'
        });
      }

      // Find and update subscriber
      const subscriber = await Subscriber.findOneAndUpdate(
        { email: email },
        { isActive: false },
        { new: true }
      );

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Subscriber not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });

    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}
