require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Footer = require('../models/Footer');

async function seedFooter() {
  try {
    // Use environment variables for MongoDB connection
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

    if (!MONGODB_URI) {
      console.error('Please set MONGODB_URI environment variable');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing footer data
    await Footer.deleteMany({});
    console.log('Deleted existing footer data');

    // Create new footer data
    const footerData = {
      email: 'hello@subekshyasart.com',
      phone: '+1 (234) 567-8901',
      address: '123 Art Street, Creative City, Country 12345',
      socialLinks: {
        facebook: 'https://facebook.com/subekshyasart',
        instagram: 'https://instagram.com/subekshyasart',
        twitter: 'https://twitter.com/subekshyasart'
      },
      newsletterText: 'Stay updated with our latest artworks and events. Join our creative community!',
      copyrightText: "Subekshya's Artistry. All rights reserved."
    };

    const footer = await Footer.create(footerData);
    console.log('Created footer data:', footer);

    console.log('Footer seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding footer data:', error);
    process.exit(1);
  }
}

seedFooter();
