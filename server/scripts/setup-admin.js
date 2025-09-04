const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panchroma', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@panchroma.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Username:', adminData.username);
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('');
    console.log('🚨 IMPORTANT: Please change the default password after first login!');
    console.log('');
    console.log('You can now access the dashboard at: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);
const resetFlag = args.includes('--reset');

if (resetFlag) {
  console.log('🔄 Resetting admin user...');
  
  const resetAdmin = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panchroma', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await User.deleteMany({ role: 'admin' });
      console.log('✅ Existing admin users removed');
      
      await setupAdmin();
    } catch (error) {
      console.error('❌ Error resetting admin:', error.message);
      process.exit(1);
    }
  };

  resetAdmin();
} else {
  setupAdmin();
}

module.exports = setupAdmin;