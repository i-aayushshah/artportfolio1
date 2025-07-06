import dbConnect from '../../lib/mongodb';
import About from '../../models/About';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await dbConnect();
        // Get the first about entry (assuming single about section)
        const about = await About.findOne({});
        res.status(200).json({ success: true, data: about });
      } catch (error) {
        console.error('About API error:', error);
        // Return default about data as fallback
        const defaultAbout = {
          title: "About the Artist",
          description: "Welcome to my artistic journey! I'm passionate about capturing the beauty of nature through various art forms. Each piece in my collection represents a moment of inspiration drawn from the natural world around us.",
          image: "/images/artist-portrait.jpg",
          skills: ["Oil Painting", "Watercolor", "Digital Art", "Nature Studies"],
          experience: "5+ years"
        };
        res.status(200).json({
          success: true,
          data: defaultAbout,
          warning: 'Database connection failed, returning default data'
        });
      }
      break;
    case 'POST':
      try {
        const about = await About.create(req.body);
        res.status(201).json({ success: true, data: about });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const about = await About.findOneAndUpdate({}, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: about });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
