const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll');

// Calculate payroll for all employees for a given month/year
router.post('/calculate', payrollController.calculatePayroll);

// Get all payrolls (optionally filter by month/year/user)
router.get('/', payrollController.getPayrolls);

// Get payroll by ID
router.get('/:id', payrollController.getPayrollById);

// Generate payslip for a payroll
router.post('/:id/payslip', payrollController.generatePayslip);

module.exports = router; 