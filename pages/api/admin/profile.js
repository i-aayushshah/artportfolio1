import bcrypt from 'bcryptjs';
const dbConnect = require('../../../lib/mongodb');
import User from '../../../models/User';
const { authenticateAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  await dbConnect();

  return authenticateAdmin(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const user = await User.findById(req.user._id).select('-password -resetToken -resetTokenExpires');

        res.status(200).json({
          success: true,
          data: user,
        });
      } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    } else if (req.method === 'PUT') {
      try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        // Update email if provided
        if (email && email !== user.email) {
          // Check if email is already taken
          const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: user._id }
          });

          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: 'Email is already taken'
            });
          }

          user.email = email.toLowerCase();
        }

        // Update password if provided
        if (newPassword) {
          if (!currentPassword) {
            return res.status(400).json({
              success: false,
              message: 'Current password is required to set new password'
            });
          }

          // Verify current password
          const isValidPassword = await bcrypt.compare(currentPassword, user.password);
          if (!isValidPassword) {
            return res.status(400).json({
              success: false,
              message: 'Current password is incorrect'
            });
          }

          if (newPassword.length < 8) {
            return res.status(400).json({
              success: false,
              message: 'New password must be at least 8 characters long'
            });
          }

          // Hash new password
          user.password = await bcrypt.hash(newPassword, 12);
        }

        await user.save();

        res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: {
            id: user._id,
            email: user.email,
            role: user.role,
          },
        });
      } catch (error) {
        console.error('Update profile error:', error);
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
