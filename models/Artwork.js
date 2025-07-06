const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    min: 0,
  },
  medium: {
    type: String,
    trim: true,
  },
  dimensions: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Prevent multiple model initialization in development
module.exports = mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);
