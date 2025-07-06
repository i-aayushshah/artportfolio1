require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const About = require('../models/About');

async function seedAbout() {
  try {
    // Use environment variables for MongoDB connection
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

    if (!MONGODB_URI) {
      console.error('Please set MONGODB_URI environment variable');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing about data
    await About.deleteMany({});
    console.log('Deleted existing about data');

    // Create new about data
    const aboutData = {
      title: 'About the Artist',
      description: 'Welcome to my artistic journey! I am a passionate artist who loves to create beautiful artwork that captures the essence of nature and human emotions. Each piece tells a unique story and reflects my deep connection with the world around me.',
      image: '/images/artist-portrait.jpg',
      skills: ['Oil Painting', 'Watercolor', 'Digital Art', 'Portrait Drawing', 'Landscape Painting'],
      experience: '8+ years'
    };

    const about = await About.create(aboutData);
    console.log('Created about data:', about);

    console.log('About seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding about data:', error);
    process.exit(1);
  }
}

seedAbout();
