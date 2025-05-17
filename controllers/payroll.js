const Payroll = require('../models/Payroll');
const Payslip = require('../models/Payslip');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

// Calculate payroll for all employees for a given month/year
exports.calculatePayroll = async (req, res) => {
  try {
    const { month, year, bonus = 0 } = req.body;
    const users = await User.find({ role: 'employee' });
    const payrolls = [];

    for (const user of users) {
      // Get attendance for the month
      const attendance = await Attendance.find({
        user: user._id,
        date: { $regex: `^${year}-${String(month).padStart(2, '0')}` }
      });
      const presents = attendance.filter(a => a.status === 'Present').length;
      const lates = attendance.filter(a => a.status === 'Late').length;
      const absents = attendance.filter(a => a.status === 'Absent').length;
      // Dynamic working days: count unique attendance days (excluding absents)
      const uniqueDays = new Set(attendance.map(a => a.date));
      const workingDays = uniqueDays.size > 0 ? uniqueDays.size : 22; // fallback to 22 if no records
      const perDay = user.salary / workingDays;
      const deduction = (absents * perDay) + (lates * perDay * 0.5);
      const netPay = user.salary + bonus - deduction;
      const payroll = await Payroll.create({
        user: user._id,
        month,
        year,
        baseSalary: user.salary,
        bonus,
        deductions: deduction,
        netPay,
        presents,
        lates,
        absents
      });
      payrolls.push(payroll);
    }
    res.status(201).json({ success: true, payrolls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all payrolls (optionally filter by month/year/user)
exports.getPayrolls = async (req, res) => {
  try {
    const { month, year, user } = req.query;
    const filter = {};
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (user) filter.user = user;
    const payrolls = await Payroll.find(filter).populate('user');
    res.json({ success: true, payrolls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get payroll by ID
exports.getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('user');
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Generate payslip for a payroll
exports.generatePayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate('user');
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll not found' });
    const payslip = await Payslip.create({
      payroll: payroll._id,
      user: payroll.user._id,
      month: payroll.month,
      year: payroll.year,
      baseSalary: payroll.baseSalary,
      bonus: payroll.bonus,
      deductions: payroll.deductions,
      netPay: payroll.netPay
    });
    res.status(201).json({ success: true, payslip });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}; 