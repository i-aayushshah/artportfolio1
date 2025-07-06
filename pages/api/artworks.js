import dbConnect from '../../lib/mongodb';
import Artwork from '../../models/Artwork';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        await dbConnect();
        const artworks = await Artwork.find({}).sort({ createdAt: -1, id: -1 });
        res.status(200).json({ success: true, data: artworks });
      } catch (error) {
        console.error('Artworks API error:', error);
        // Return empty array as fallback
        res.status(200).json({
          success: true,
          data: [],
          warning: 'Database connection failed, returning empty data'
        });
      }
      break;
    case 'POST':
      try {
        const artwork = await Artwork.create(req.body);
        res.status(201).json({ success: true, data: artwork });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
