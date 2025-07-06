require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const dbConnect = require('../lib/mongodb');
const User = require('../models/User');

async function createAdmin() {
  try {
    await dbConnect();

    console.log('Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sujalart.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@1234', 12);

    // Create admin user
    const admin = new User({
      email: 'admin@sujalart.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email: admin@sujalart.com');
    console.log('Password: Admin@1234');
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
