const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  from_date: { type: String, required: true }, // YYYY-MM-DD
  to_date: { type: String, required: true },   // YYYY-MM-DD
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  applied_on: { type: Date, default: Date.now },
  decision_on: { type: Date },
  decision_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Leave', LeaveSchema); 