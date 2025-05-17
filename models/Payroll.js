const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  presents: { type: Number, default: 0 },
  lates: { type: Number, default: 0 },
  absents: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', PayrollSchema); 