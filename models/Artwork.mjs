import mongoose from 'mongoose';

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
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

// Prevent multiple model initialization in development
export default mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);
