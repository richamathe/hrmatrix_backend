const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name, 
      designation,
      mobile,
      email,
      gender,
      dob,
      password,
      joiningDate,
      department,
      position,
      address,
      role
    } = req.body;

    // Check if employee already exists
    let employee = await User.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee
    employee = new User({
      name,
      designation,
      mobile,
      email,
      gender,
      dob,
      password,
      joiningDate,
      department: department || 'IT',
      position: position || 'Staff',
      address,
      role: role || 'employee'
    });

    await employee.save();

    // Remove password from response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json(employeeResponse);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      designation,
      mobile,
      email,
      gender,
      dob,
      password,
      joiningDate,
      department,
      position,
      address,
      role
    } = req.body;

    // Find employee
    let employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update fields
    const updateFields = {
      name,
      designation,
      mobile,
      email,
      gender,
      dob,
      joiningDate,
      department,
      position,
      address,
      role
    };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Update employee
    employee = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 