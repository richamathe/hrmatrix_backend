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

// Routes only accessible by HR and Admin
router.route('/')
  .get(authorize('hr', 'admin'), getUsers);

router.route('/:id')
  .get(authorize('hr', 'admin'), getUser)
  .put(authorize('hr', 'admin'), updateUser)
  .delete(authorize('hr', 'admin'), deleteUser);

module.exports = router;
