const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  checkIn: {
    type: String, // HH:mm:ss
    default: ''
  },
  checkOut: {
    type: String, // HH:mm:ss
    default: ''
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'Pending'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AttendanceSchema.pre('save', function(next) {
  if (this.checkIn) {
    const [hour] = this.checkIn.split(':').map(Number);
    if (hour >= 11) {
      this.status = 'Late';
    } else {
      this.status = 'Present';
    }
  }
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema); 