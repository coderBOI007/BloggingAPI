const express = require('express');
const { body } = require('express-validator');
const { signup, signin } = require('./controller/auth.controller');
const { validate } = require('./Middleware/validation.middleware');

const router = express.Router();

router.post('/signup', [
  body('first_name').notEmpty().trim().withMessage('First name is required'),
  body('last_name').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], signup);

router.post('/signin', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], signin);

module.exports = router;
