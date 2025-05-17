const express = require('express');
const { requestLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, getMyLeaveBalance } = require('../controllers/leave');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Employee
router.post('/', protect, authorize('employee', 'hr'), requestLeave);
router.get('/my', protect, authorize('employee', 'hr'), getMyLeaves);
router.get('/my-balance', protect, authorize('employee', 'hr'), getMyLeaveBalance);

// HR
router.get('/all', protect, authorize('hr'), getAllLeaves);
router.put('/:id', protect, authorize('hr'), updateLeaveStatus);

module.exports = router; 