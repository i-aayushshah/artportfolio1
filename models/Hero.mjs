import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  backgroundImage: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    default: 'Explore Gallery',
  },
  ctaLink: {
    type: String,
    default: '/portfolio',
  },
}, {
  timestamps: true,
});

// Prevent multiple model initialization in development
export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
