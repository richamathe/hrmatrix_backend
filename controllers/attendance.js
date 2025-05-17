const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Employee: Check-in
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkInTime = now.toTimeString().split(' ')[0];

    // Prevent check-in after 11:00 AM
    const hour = now.getHours();
    if (hour >= 11) {
      return res.status(400).json({ success: false, message: 'Check-in not allowed after 11:00 AM.' });
    }

    // Find today's attendance
    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'You have already checked in today.' });
    }
    if (!attendance) {
      attendance = new Attendance({ user: userId, date: today });
    }
    attendance.checkIn = checkInTime;
    // status will be set by pre-save hook
    await attendance.save();
    res.json({ success: true, record: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Employee: Check-out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const checkOutTime = now.toTimeString().split(' ')[0];

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) {
      return res.status(400).json({ success: false, message: 'Check-in first' });
    }
    attendance.checkOut = checkOutTime;
    await attendance.save();
    res.json({ success: true, record: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Employee: Get own attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// HR: Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, department, status } = req.query;
    let filter = {};
    if (date) filter.date = date;
    if (status) filter.status = status;
    if (department) {
      // Find users in department
      const users = await User.find({ department }).select('_id');
      filter.user = { $in: users.map(u => u._id) };
    }
    // Populate user details
    const records = await Attendance.find(filter).populate('user', 'name email department _id');
    // Map to include employee_name, employee_id, department for frontend
    const mappedRecords = records.map(r => ({
      ...r.toObject(),
      employee_name: r.user?.name || '',
      employee_id: r.user?._id?.toString() || '',
      department: r.user?.department || '',
    }));
    res.json({ success: true, records: mappedRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 