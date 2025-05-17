const mongoose = require('mongoose');

const PayslipSchema = new mongoose.Schema({
  payroll: { type: mongoose.Schema.Types.ObjectId, ref: 'Payroll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payslip', PayslipSchema); 