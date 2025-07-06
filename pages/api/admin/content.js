const dbConnect = require('../../../lib/mongodb');
import Hero from '../../../models/Hero';
import About from '../../../models/About';
import Footer from '../../../models/Footer';
const { authenticateAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  await dbConnect();

  return authenticateAdmin(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const { section } = req.query;

        let data;
        switch (section) {
          case 'hero':
            data = await Hero.findOne({});
            break;
          case 'about':
            data = await About.findOne({});
            break;
          case 'footer':
            data = await Footer.findOne({});
            break;
          default:
            return res.status(400).json({
              success: false,
              message: 'Invalid section. Use: hero, about, or footer'
            });
        }

        res.status(200).json({
          success: true,
          data: data || {},
        });
      } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else if (req.method === 'PUT') {
      try {
        const { section, ...updateData } = req.body;

        if (!section) {
          return res.status(400).json({
            success: false,
            message: 'Section is required'
          });
        }

        let model, data;
        switch (section) {
          case 'hero':
            model = Hero;
            break;
          case 'about':
            model = About;
            break;
          case 'footer':
            model = Footer;
            break;
          default:
            return res.status(400).json({
              success: false,
              message: 'Invalid section. Use: hero, about, or footer'
            });
        }

        // Try to update existing document, or create new one if it doesn't exist
        data = await model.findOneAndUpdate(
          {},
          updateData,
          { new: true, upsert: true }
        );

        res.status(200).json({
          success: true,
          message: `${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`,
          data,
        });
      } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  });
}
