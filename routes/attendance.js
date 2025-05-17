const express = require('express');
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
} = require('../controllers/attendance');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Employee routes
router.post('/checkin', protect, authorize('employee', 'hr'), checkIn);
router.post('/checkout', protect, authorize('employee', 'hr'), checkOut);
router.get('/my', protect, authorize('employee', 'hr'), getMyAttendance);

// HR route
router.get('/', protect, authorize('hr'), getAllAttendance);

module.exports = router; 