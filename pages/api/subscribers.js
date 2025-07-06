const dbConnect = require('../../lib/mongodb');
import Subscriber from '../../models/Subscriber';
const { authenticateAdmin } = require('../../lib/auth');

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    // Get all subscribers (admin only)
    return authenticateAdmin(req, res, async () => {
      try {
        const subscribers = await Subscriber.find({ isActive: true })
          .sort({ createdAt: -1 })
          .select('email createdAt source');

        res.status(200).json({
          success: true,
          data: subscribers,
          count: subscribers.length,
        });
      } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    });
  } else if (req.method === 'POST') {
    // Subscribe to newsletter (public)
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if already subscribed
      const existingSubscriber = await Subscriber.findOne({
        email: email.toLowerCase()
      });

      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(400).json({
            success: false,
            message: 'Email is already subscribed'
          });
        } else {
          // Reactivate subscription
          existingSubscriber.isActive = true;
          await existingSubscriber.save();
          return res.status(200).json({
            success: true,
            message: 'Successfully resubscribed to newsletter',
          });
        }
      }

      // Create new subscriber
      const subscriber = new Subscriber({
        email: email.toLowerCase(),
        source: 'website',
      });

      await subscriber.save();

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to newsletter',
      });
    } catch (error) {
      console.error('Subscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  } else if (req.method === 'DELETE') {
    // Unsubscribe or delete subscriber (admin only)
    return authenticateAdmin(req, res, async () => {
      try {
        const { email } = req.body;

        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email is required'
          });
        }

        const subscriber = await Subscriber.findOneAndUpdate(
          { email: email.toLowerCase() },
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
          message: 'Subscriber unsubscribed successfully',
        });
      } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    });
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
