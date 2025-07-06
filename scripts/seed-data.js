require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Footer = require('../models/Footer');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  console.log('📝 Please create a .env.local file with:');
  console.log('MONGODB_URI=mongodb+srv://aayushshah820:YOUR_PASSWORD@cluster0.0mwi2sv.mongodb.net/art-portfolio?retryWrites=true&w=majority');
  process.exit(1);
}

// Artworks data (from your existing data.json)
const artworksData = [
  {
    id: 1,
    title: "Sunset Serenity",
    image: "/images/sunset-serenity.jpg",
    description: "A calming landscape painting featuring a vibrant sunset over serene waters. This piece captures the tranquility of nature's most beautiful moments, with warm golden hues reflecting off the water's surface.",
    price: 500
  },
  {
    id: 2,
    title: "Urban Rhythm",
    image: "/images/urban-rhythm.jpg",
    description: "An abstract representation of city life, capturing the energy and movement of urban environments. Bold strokes and dynamic colors convey the pulse of metropolitan life.",
    price: 750
  },
  {
    id: 3,
    title: "Floral Dreams",
    image: "/images/floral-dreams.jpg",
    description: "A delicate watercolor painting of a colorful bouquet, evoking feelings of spring and renewal. Soft pastels and flowing brushstrokes create a dreamy, romantic atmosphere.",
    price: 300
  },
  {
    id: 4,
    title: "Cosmic Journey",
    image: "/images/cosmic-journey.jpg",
    description: "An otherworldly digital art piece exploring the vastness and mystery of space. Deep blues and purples create an immersive experience of cosmic wonder.",
    price: 600
  },
  {
    id: 5,
    title: "Whispers of Nature",
    image: "/images/whispers-of-nature.jpg",
    description: "A mixed media artwork combining elements of photography and painting to showcase the beauty of natural textures. This piece celebrates the intricate details found in nature.",
    price: 450
  },
  {
    id: 6,
    title: "Emotional Cascade",
    image: "/images/emotional-cascade.jpg",
    description: "An expressive abstract painting using bold brushstrokes and vibrant colors to convey a range of emotions. Each stroke tells a story of human experience.",
    price: 800
  },
  {
    id: 7,
    title: "Emotional Cascade II",
    image: "/images/emotional-cascade1.jpg",
    description: "A continuation of emotional expression through abstract art, exploring deeper layers of human consciousness and feeling.",
    price: 800
  }
];

// Hero section data
const heroData = {
  title: "Subekshya's Artistry",
  subtitle: "Where imagination meets canvas, creating timeless masterpieces that speak to the soul",
  backgroundImage: "/images/artist-portrait.jpg",
  ctaText: "Explore Gallery",
  ctaLink: "/portfolio"
};

// About section data
const aboutData = {
  title: "About the Artist",
  content: "Welcome to my artistic journey where every brushstroke tells a story and every color evokes emotion. I believe that art has the power to transform spaces and touch hearts, creating connections that transcend language and culture.",
  image: "/images/artist-portrait.jpg",
  artistName: "Subekshya",
  artistBio: "A passionate artist with over 5 years of experience in creating unique and meaningful artworks. My work spans various mediums including oil painting, watercolor, digital art, and mixed media. Each piece is crafted with intention, drawing inspiration from nature, emotions, and the human experience.",
  specialties: ["Oil Painting", "Watercolor", "Digital Art", "Mixed Media", "Abstract Art"],
  experience: "5+ years"
};

// Footer section data
const footerData = {
  email: "hello@subekshyasart.com",
  phone: "+1 (234) 567-8901",
  address: "123 Art Street, Creative City, CC 12345",
  socialLinks: {
    facebook: "https://www.facebook.com/subekshyasart",
    instagram: "https://www.instagram.com/subekshyasart",
    twitter: "https://www.twitter.com/subekshyasart",
    linkedin: "https://www.linkedin.com/in/subekshyasart"
  },
  newsletterText: "Stay updated with our latest artworks and events.",
  copyrightText: "Subekshya's Artistry. All rights reserved."
};

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📡 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Artwork.deleteMany({});
    await Hero.deleteMany({});
    await About.deleteMany({});
    await Footer.deleteMany({});
    console.log('✅ Cleared existing data');

    // Seed artworks
    console.log('🎨 Seeding artworks...');
    const artworks = await Artwork.insertMany(artworksData);
    console.log(`✅ Seeded ${artworks.length} artworks`);

    // Seed hero
    console.log('🏠 Seeding hero section...');
    const hero = await Hero.create(heroData);
    console.log('✅ Seeded hero section');

    // Seed about
    console.log('👤 Seeding about section...');
    const about = await About.create(aboutData);
    console.log('✅ Seeded about section');

    // Seed footer
    console.log('📄 Seeding footer section...');
    const footer = await Footer.create(footerData);
    console.log('✅ Seeded footer section');

    console.log('🎉 Database seeding completed successfully!');
    console.log('🚀 You can now run: npm run dev');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);

    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your password in .env.local');
      console.log('2. Make sure special characters are URL-encoded');
      console.log('3. Verify the user exists in MongoDB Atlas');
      console.log('4. Check Network Access settings in Atlas');
    }

    process.exit(1);
  }
}

seedDatabase();
