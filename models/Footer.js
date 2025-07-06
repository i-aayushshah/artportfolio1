const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  socialLinks: {
    facebook: {
      type: String,
      default: '#',
    },
    instagram: {
      type: String,
      default: '#',
    },
    twitter: {
      type: String,
      default: '#',
    },
    linkedin: {
      type: String,
      default: '#',
    },
  },
  newsletterText: {
    type: String,
    default: 'Stay updated with our latest artworks and events.',
  },
  copyrightText: {
    type: String,
    default: "Subekshya's Artistry. All rights reserved.",
  },
}, {
  timestamps: true,
});

// Prevent multiple model initialization in development
module.exports = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);
