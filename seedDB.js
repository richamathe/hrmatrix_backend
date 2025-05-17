const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return false;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Connect to the database
    const connected = await connectDB();
    if (!connected) {
      console.log('Failed to connect to MongoDB. Cannot seed database.');
      return;
    }

    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Create HR user
    const hrUser = await User.create({
      name: 'HR Manager',
      email: 'hr@example.com',
      password: 'password123', // Will be hashed by the pre-save hook
      role: 'hr',
      department: 'HR',
      position: 'HR Manager',
      joinDate: new Date(),
      phone: '123-456-7890',
      address: '123 Main St, City, Country'
    });
    console.log('HR user created:', hrUser.name);

    // Create Employee user
    const employeeUser = await User.create({
      name: 'Test Employee',
      email: 'employee@example.com',
      password: 'password123', // Will be hashed by the pre-save hook
      role: 'employee',
      department: 'IT',
      position: 'Software Developer',
      joinDate: new Date(),
      phone: '987-654-3210',
      address: '456 Oak St, City, Country'
    });
    console.log('Employee user created:', employeeUser.name);

    // Create a file to indicate seeding is complete
    const seedFlagPath = path.join(__dirname, '.seed-complete');
    fs.writeFileSync(seedFlagPath, new Date().toISOString());
    console.log('Database seeding completed successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeder
seedUsers();
