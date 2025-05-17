const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllEmployees,
  getBirthdaysThisMonth,
  getDepartmentStats
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Specific routes for HR dashboard (must be above /:id)
router.get('/all', getAllEmployees);
router.get('/birthdays', getBirthdaysThisMonth);
router.get('/department-stats', getDepartmentStats);

// Routes only accessible by HR
router.route('/')
  .get(authorize('hr'), getUsers);

router.route('/:id')
  .get(authorize('hr'), getUser)
  .put(authorize('hr'), updateUser)
  .delete(authorize('hr'), deleteUser);

module.exports = router;
