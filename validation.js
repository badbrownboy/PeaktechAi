const { body, validationResult } = require('express-validator');

// Common validation rules
const nameValidation = body('firstName')
  .trim()
  .isLength({ min: 1, max: 50 })
  .withMessage('First name must be between 1 and 50 characters')
  .matches(/^[a-zA-Z\s-']+$/)
  .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes');

const lastNameValidation = body('lastName')
  .trim()
  .isLength({ min: 1, max: 50 })
  .withMessage('Last name must be between 1 and 50 characters')
  .matches(/^[a-zA-Z\s-']+$/)
  .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes');

const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const companyValidation = body('company')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('Company name must be less than 100 characters');

// Contact form validation
const contactValidation = [
  nameValidation,
  lastNameValidation,
  emailValidation,
  companyValidation,
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Resume form validation
const resumeValidation = [
  nameValidation,
  lastNameValidation,
  emailValidation,
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('position')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Position must be between 1 and 100 characters'),
  body('experience')
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Please select a valid experience level'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter must be less than 2000 characters')
];

// Project form validation
const projectValidation = [
  nameValidation,
  lastNameValidation,
  emailValidation,
  companyValidation,
  body('projectTitle')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Project title must be between 5 and 200 characters'),
  body('projectDescription')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Project description must be between 20 and 5000 characters'),
  body('projectType')
    .isIn(['web-app', 'mobile-app', 'ai-solution', 'platform', 'integration', 'other'])
    .withMessage('Please select a valid project type'),
  body('budget')
    .optional()
    .isIn(['under-10k', '10k-25k', '25k-50k', '50k-100k', '100k-plus', 'not-specified'])
    .withMessage('Please select a valid budget range'),
  body('timeline')
    .optional()
    .isIn(['asap', '1-month', '2-3-months', '3-6-months', '6-months-plus', 'flexible'])
    .withMessage('Please select a valid timeline'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array')
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  contactValidation,
  resumeValidation,
  projectValidation,
  handleValidationErrors
};
