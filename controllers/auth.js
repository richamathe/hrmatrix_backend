const User = require('../models/User');
const upload = require('../config/multer');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      designation,
      mobile,
      email, 
      gender,
      dob,
      joiningDate,
      password, 
      role, 
      department, 
      address 
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Get profile photo path if uploaded
    const profilePhoto = req.file ? req.file.path : 'default-profile.jpg';

    // Create user
    const user = await User.create({
      name,
      designation,
      mobile,
      email,
      gender,
      dob,
      joiningDate,
      password,
      role: role || 'employee',
      department,
      address,
      profilePhoto
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        designation: user.designation,
        mobile: user.mobile,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        joiningDate: user.joiningDate,
        role: user.role,
        department: user.department,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        designation: user.designation,
        mobile: user.mobile,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        joiningDate: user.joiningDate,
        role: user.role,
        department: user.department,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
