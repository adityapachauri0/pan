const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    throw new AppError(errorMessages.join(', '), 400);
  }
  next();
};

// Common validators
const validators = {
  // User registration validation
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain uppercase, lowercase, number and special character'),
    validate
  ],

  // Login validation
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    validate
  ],

  // Contact form validation
  contactSubmission: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
      .escape(),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('subject')
      .trim()
      .notEmpty().withMessage('Subject is required')
      .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters')
      .escape(),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
      .escape(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
      .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
    validate
  ],

  // ID parameter validation
  mongoId: [
    param('id')
      .isMongoId().withMessage('Invalid ID format'),
    validate
  ],

  // Status update validation
  updateStatus: [
    param('id')
      .isMongoId().withMessage('Invalid ID format'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(['new', 'read', 'contacted', 'converted', 'archived'])
      .withMessage('Invalid status value'),
    validate
  ],

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt'])
      .withMessage('Invalid sort parameter'),
    validate
  ],

  // Project validation
  project: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters')
      .escape(),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters')
      .escape(),
    body('technologies')
      .isArray().withMessage('Technologies must be an array')
      .notEmpty().withMessage('At least one technology is required'),
    body('technologies.*')
      .trim()
      .isLength({ min: 1, max: 50 }).withMessage('Technology name must be between 1 and 50 characters')
      .escape(),
    body('imageUrl')
      .optional()
      .trim()
      .isURL().withMessage('Invalid image URL'),
    body('link')
      .optional()
      .trim()
      .isURL().withMessage('Invalid project link'),
    body('featured')
      .optional()
      .isBoolean().withMessage('Featured must be a boolean'),
    validate
  ]
};

// Sanitize input helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any script tags
  input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove any HTML tags
  input = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  input = input.trim();
  
  return input;
};

module.exports = {
  validators,
  validate,
  sanitizeInput
};