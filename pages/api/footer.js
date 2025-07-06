import dbConnect from '../../lib/mongodb';
import Footer from '../../models/Footer';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await dbConnect();
        // Get the first footer entry (assuming single footer section)
        const footer = await Footer.findOne({});
        res.status(200).json({ success: true, data: footer });
      } catch (error) {
        console.error('Footer API error:', error);
        // Return default footer data as fallback
        const defaultFooter = {
          copyrightText: "© 2024 Subekshya's Artistry. All rights reserved.",
          socialLinks: {
            facebook: "",
            instagram: "",
            twitter: "",
            email: "contact@subekshyasartistry.com"
          }
        };
        res.status(200).json({
          success: true,
          data: defaultFooter,
          warning: 'Database connection failed, returning default data'
        });
      }
      break;
    case 'POST':
      try {
        const footer = await Footer.create(req.body);
        res.status(201).json({ success: true, data: footer });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const footer = await Footer.findOneAndUpdate({}, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: footer });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
