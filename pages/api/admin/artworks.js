const dbConnect = require('../../../lib/mongodb');
import Artwork from '../../../models/Artwork';
import Subscriber from '../../../models/Subscriber';
const { authenticateAdmin } = require('../../../lib/auth');
import nodemailer from 'nodemailer';
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Email notification function
const notifySubscribers = async (artwork) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true });

    if (subscribers.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "aayushshah983@gmail.com",
        pass: 'ywdesayrmevuyjvo',
      },
    });

    // Send individual emails to include personalized unsubscribe links
    for (const subscriber of subscribers) {
      const unsubscribeToken = Buffer.from(subscriber.email).toString('base64');
      const unsubscribeUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${unsubscribeToken}`;

      const mailOptions = {
        from: "aayushshah983@gmail.com",
        to: subscriber.email,
        subject: `New Artwork Added: ${artwork.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d97706;">New Artwork Added!</h2>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${artwork.image}" alt="${artwork.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            </div>
            <h3 style="color: #374151;">${artwork.title}</h3>
            <p style="color: #6b7280; line-height: 1.6;">${artwork.description}</p>
            <div style="margin: 20px 0;">
              <p><strong>Medium:</strong> ${artwork.medium}</p>
              <p><strong>Dimensions:</strong> ${artwork.dimensions}</p>
              <p><strong>Category:</strong> ${artwork.category}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/portfolio" style="background: linear-gradient(to right, #d97706, #059669); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">View Portfolio</a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              Subekshya's Artistry
            </p>
            <p style="color: #9ca3af; font-size: 12px;">
              If you no longer wish to receive these updates,
              <a href="${unsubscribeUrl}" style="color: #d97706; text-decoration: none;">click here to unsubscribe</a>.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }
    console.log(`Notified ${subscribers.length} subscribers about new artwork: ${artwork.title}`);
  } catch (error) {
    console.error('Error notifying subscribers:', error);
  }
};

export default async function handler(req, res) {
  await dbConnect();

  return authenticateAdmin(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const artworks = await Artwork.find({}).sort({ createdAt: -1 });
        res.status(200).json({
          success: true,
          data: artworks,
        });
      } catch (error) {
        console.error('Get artworks error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else if (req.method === 'POST') {
      try {
        const { title, description, image, medium, dimensions, category, year, price, isAvailable } = req.body;

        if (!title || !description || !image) {
          return res.status(400).json({
            success: false,
            message: 'Title, description, and image are required'
          });
        }

        // Generate unique ID
        const lastArtwork = await Artwork.findOne().sort({ id: -1 });
        const nextId = lastArtwork ? lastArtwork.id + 1 : 1;

        const artwork = new Artwork({
          id: nextId,
          title,
          description,
          image,
          medium,
          dimensions,
          category,
          year: year ? parseInt(year) : undefined,
          price: price ? parseFloat(price) : undefined,
          isAvailable: isAvailable !== false,
        });

        await artwork.save();

        // Notify subscribers about new artwork
        await notifySubscribers(artwork);

        res.status(201).json({
          success: true,
          message: 'Artwork created successfully',
          data: artwork,
        });
      } catch (error) {
        console.error('Create artwork error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else if (req.method === 'PUT') {
      try {
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Artwork ID is required'
          });
        }

        const artwork = await Artwork.findByIdAndUpdate(id, updateData, { new: true });

        if (!artwork) {
          return res.status(404).json({
            success: false,
            message: 'Artwork not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Artwork updated successfully',
          data: artwork,
        });
      } catch (error) {
        console.error('Update artwork error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else if (req.method === 'DELETE') {
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Artwork ID is required'
          });
        }

        const artwork = await Artwork.findById(id);

        if (!artwork) {
          return res.status(404).json({
            success: false,
            message: 'Artwork not found'
          });
        }

        // Delete the image from Cloudinary if it's a Cloudinary URL
        if (artwork.image && artwork.image.includes('cloudinary.com')) {
          try {
            // Extract public ID from Cloudinary URL
            const urlParts = artwork.image.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            const folderPath = 'art-portfolio/' + publicId;

            await cloudinary.uploader.destroy(folderPath);
            console.log(`Deleted image from Cloudinary: ${folderPath}`);
          } catch (fileError) {
            console.error('Error deleting image from Cloudinary:', fileError);
            // Continue with artwork deletion even if image deletion fails
          }
        }

        await Artwork.findByIdAndDelete(id);

        res.status(200).json({
          success: true,
          message: 'Artwork deleted successfully',
        });
      } catch (error) {
        console.error('Delete artwork error:', error);
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
