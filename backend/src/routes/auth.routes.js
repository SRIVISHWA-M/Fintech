const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../utils/validationSchemas');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
