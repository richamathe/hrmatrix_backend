const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('name email department dob profilePhoto');
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get birthdays this month
exports.getBirthdaysThisMonth = async (req, res) => {
  try {
    const month = req.query.month || (new Date().getMonth() + 1);
    const regex = new RegExp(`^\\d{4}-${month.toString().padStart(2, '0')}`);
    const employees = await User.find({
      role: 'employee',
      dob: { $regex: regex }
    }).select('name dob department profilePhoto');
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get department stats
exports.getDepartmentStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Handle profile photo upload if present
    if (req.file) {
      req.body.profilePhoto = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
