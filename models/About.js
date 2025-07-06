const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  experience: {
    type: String,
    default: '5+ years',
  },
  // Legacy fields for backward compatibility
  content: {
    type: String,
  },
  artistName: {
    type: String,
    trim: true,
  },
  artistBio: {
    type: String,
  },
  specialties: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Add a transform to handle legacy data
AboutSchema.methods.toJSON = function() {
  const obj = this.toObject();

  // If we have legacy data, map it to new fields
  if (obj.content && !obj.description) {
    obj.description = obj.content;
  }
  if (obj.specialties && !obj.skills) {
    obj.skills = obj.specialties;
  }
  if (obj.artistName && !obj.title) {
    obj.title = `About ${obj.artistName}`;
  }

  return obj;
};

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema);
