const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  source: {
    type: String,
    default: 'website',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
