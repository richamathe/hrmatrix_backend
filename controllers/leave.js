const Leave = require('../models/Leave');

// Employee: Request leave
exports.requestLeave = async (req, res) => {
  try {
    const leave = new Leave({
      user: req.user._id,
      type: req.body.type,
      from_date: req.body.from_date,
      to_date: req.body.to_date,
      reason: req.body.reason
    });
    await leave.save();
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Employee: Get own leave requests
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ applied_on: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// HR: Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('user', 'name email department').sort({ applied_on: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// HR: Approve/Reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    leave.status = req.body.status;
    leave.decision_on = new Date();
    leave.decision_by = req.user._id;
    await leave.save();
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get leave balance for logged-in employee
exports.getMyLeaveBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    // TODO: Replace with real aggregation from leave records or a LeaveBalance model
    const balances = {
      casual: { total: 12, used: 3, remaining: 9 },
      sick: { total: 10, used: 2, remaining: 8 },
      earned: { total: 15, used: 0, remaining: 15 }
    };
    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 