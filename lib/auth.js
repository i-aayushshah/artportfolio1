const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dbConnect = require('./mongodb');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to protect admin routes
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') ||
                  req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
const generateResetToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateAdmin,
  generateOTP,
  generateResetToken,
};
