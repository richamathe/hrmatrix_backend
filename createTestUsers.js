const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr-management')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createUsers = async () => {
  try {
    // Check if users already exist
    const hrExists = await User.findOne({ email: 'hr@example.com' });
    const employeeExists = await User.findOne({ email: 'employee@example.com' });

    if (!hrExists) {
      // Create HR user
      const hrUser = new User({
        name: 'HR Manager',
        email: 'hr@example.com',
        password: 'hr123456',
        role: 'hr',
        department: 'HR',
        position: 'HR Manager'
      });
      await hrUser.save();
      console.log('HR user created successfully');
    } else {
      console.log('HR user already exists');
    }

    if (!employeeExists) {
      // Create Employee user
      const employeeUser = new User({
        name: 'Test Employee',
        email: 'employee@example.com',
        password: 'emp123456',
        role: 'employee',
        department: 'IT',
        position: 'Developer'
      });
      await employeeUser.save();
      console.log('Employee user created successfully');
    } else {
      console.log('Employee user already exists');
    }

    console.log('Test users setup complete');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUsers();
