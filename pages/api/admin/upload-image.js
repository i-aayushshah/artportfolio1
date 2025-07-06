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

// Helper function to validate image
const validateImageData = (imageData) => {
  if (!imageData || typeof imageData !== 'string') {
    return 'Invalid image data provided';
  }

  // Check if it's a valid base64 data URL
  if (!imageData.startsWith('data:image/')) {
    return 'Invalid image format. Please upload a valid image file';
  }

  // Extract MIME type
  const mimeMatch = imageData.match(/^data:image\/([a-zA-Z+]+);base64,/);
  if (!mimeMatch) {
    return 'Invalid image format';
  }

  const mimeType = mimeMatch[1].toLowerCase();
  const allowedMimes = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

  if (!allowedMimes.includes(mimeType)) {
    return 'Unsupported image format. Please use PNG, JPG, WEBP, or GIF';
  }

  // Estimate file size from base64 (base64 is ~33% larger than original)
  const base64Data = imageData.split(',')[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (sizeInBytes > maxSize) {
    return 'File size exceeds 5MB limit';
  }

  return null;
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

      // Validate image data
      const validationError = validateImageData(image);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError
        });
      }

      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'art-portfolio', // Optional: organize images in a folder
        resource_type: 'auto',
        allowed_formats: ['png', 'jpg', 'jpeg', 'webp', 'gif'], // Additional Cloudinary validation
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

      // Handle specific Cloudinary errors
      if (error.message && error.message.includes('Invalid image file')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image file. Please upload a valid PNG, JPG, WEBP, or GIF image'
        });
      }

      res.status(500).json({
        success: false,
        message: `Image upload failed: ${error.message}`
      });
    }
  });
}
