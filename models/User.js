const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  designation: {
    type: String,
    required: [true, 'Please add a designation'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number'],
    maxlength: [20, 'Mobile number cannot be longer than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  gender: {
    type: String,
    
  },
  dob: {
    type: String,
    required: [true, 'Please add date of birth']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Please add joining date'],
    default: Date.now
  },
  profilePhoto: {
    type: String,
    default: 'default-profile.jpg'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['employee', 'hr'],
    default: 'employee'
  },
  department: {
    type: String,
    enum: ['HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales'],
    default: 'IT'
  },
  position: {
    type: String,
    default: 'Staff'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  address: {
    type: String
  },
  salary: {
    type: Number,
    required: true,
    default: 30000 // Default value, can be changed per user
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
