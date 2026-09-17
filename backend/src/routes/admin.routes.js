const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminLoanController = require('../controllers/adminLoan.controller');

const router = express.Router();

// Currently open for super admin (ideally should have role-based middleware)
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Loan Management Routes
router.get('/loans', adminLoanController.getAllLoans);
router.post('/loans', adminLoanController.createLoan);
router.put('/loans/:id', adminLoanController.updateLoan);
router.delete('/loans/:id', adminLoanController.deleteLoan);

module.exports = router;
