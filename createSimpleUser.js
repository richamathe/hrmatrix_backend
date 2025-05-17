const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr-management')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a simple user schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  department: String,
  position: String
});

// Create a model
const User = mongoose.model('User', UserSchema);

const createUsers = async () => {
  try {
    // Delete existing test users
    await User.deleteMany({ email: { $in: ['test.hr@example.com', 'test.employee@example.com'] } });
    console.log('Deleted existing test users');

    // Create HR user
    const salt = await bcrypt.genSalt(10);
    const hrPassword = await bcrypt.hash('password123', salt);
    
    const hrUser = new User({
      name: 'Test HR',
      email: 'test.hr@example.com',
      password: hrPassword,
      role: 'hr',
      department: 'HR',
      position: 'HR Manager'
    });
    
    await hrUser.save();
    console.log('HR user created successfully');

    // Create Employee user
    const empPassword = await bcrypt.hash('password123', salt);
    
    const employeeUser = new User({
      name: 'Test Employee',
      email: 'test.employee@example.com',
      password: empPassword,
      role: 'employee',
      department: 'IT',
      position: 'Developer'
    });
    
    await employeeUser.save();
    console.log('Employee user created successfully');

    console.log('Test users created with password: password123');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    mongoose.disconnect();
  }
};

createUsers();
