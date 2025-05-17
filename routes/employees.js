const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const employeeController = require('../controllers/employees');


router.get('/all', protect, employeeController.getEmployees);
router.post('/', protect, employeeController.createEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, employeeController.deleteEmployee);

module.exports = router; 