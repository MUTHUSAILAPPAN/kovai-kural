const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('handle').trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  validate
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
];

// Post validators
const createPostValidator = [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('content').optional().trim(),
  body('category').optional().isMongoId(),
  validate
];

// Comment validators
const createCommentValidator = [
  body('content').trim().isLength({ min: 1, max: 1000 }),
  validate
];

// User validators
const updateProfileValidator = [
  body('name').optional().trim().notEmpty(),
  body('handle').optional().trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('bio').optional().trim().isLength({ max: 500 }),
  validate
];

const changePasswordValidator = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
];

// ID validators
const mongoIdValidator = [
  param('id').isMongoId(),
  validate
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  createPostValidator,
  createCommentValidator,
  updateProfileValidator,
  changePasswordValidator,
  mongoIdValidator
};
