const { v2: cloudinary } = require('cloudinary');
const { authenticateAdmin } = require('../../../lib/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js default body parser for this route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  return authenticateAdmin(req, res, async () => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'No image data provided'
        });
      }

      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'art-portfolio', // Optional: organize images in a folder
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' }, // Automatic quality optimization
          { fetch_format: 'auto' }, // Automatic format optimization
        ]
      });

      // Return the Cloudinary URL
      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        imagePath: uploadResponse.secure_url,
        publicId: uploadResponse.public_id // Store this if you need to delete images later
      });

    } catch (error) {
      console.error('Image upload failed:', error);
      res.status(500).json({
        success: false,
        message: `Image upload failed: ${error.message}`
      });
    }
  });
}
