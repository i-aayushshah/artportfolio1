import dbConnect from '../../lib/mongodb';
import Hero from '../../models/Hero';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await dbConnect();
        // Get the first hero entry (assuming single hero section)
        const hero = await Hero.findOne({});
        res.status(200).json({ success: true, data: hero });
      } catch (error) {
        console.error('Hero API error:', error);
        // Return default hero data as fallback
        const defaultHero = {
          title: "Welcome to Subekshya's Artistry",
          subtitle: "Discover Nature's Beauty Through Art",
          description: "Explore a stunning collection of artwork inspired by the natural world. Each piece tells a story of color, emotion, and the timeless beauty that surrounds us.",
          backgroundImage: "/images/art.jpg"
        };
        res.status(200).json({
          success: true,
          data: defaultHero,
          warning: 'Database connection failed, returning default data'
        });
      }
      break;
    case 'POST':
      try {
        const hero = await Hero.create(req.body);
        res.status(201).json({ success: true, data: hero });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const hero = await Hero.findOneAndUpdate({}, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: hero });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
