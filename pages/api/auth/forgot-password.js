import nodemailer from 'nodemailer';
const dbConnect = require('../../../lib/mongodb');
import User from '../../../models/User';
const { generateResetToken } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "aayushshah983@gmail.com",
        pass: 'ywdesayrmevuyjvo',
      },
    });

    const mailOptions = {
      from: "aayushshah983@gmail.com",
      to: user.email,
      subject: 'Password Reset - Subekshya\'s Artistry Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d97706;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your admin account at Subekshya's Artistry.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(to right, #d97706, #059669); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            Subekshya's Artistry Team
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
