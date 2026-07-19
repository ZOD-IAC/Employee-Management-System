import { body } from 'express-validator';

export const createEmployeeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('joiningDate').isISO8601().withMessage('Invalid joining date'),
  body('role').isIn(['HR_MANAGER', 'EMPLOYEE']).withMessage('Invalid role'),
  body('reportingManager').optional().isMongoId(),
];

export const updateEmployeeValidation = [
  body('name').optional().notEmpty(),
  body('phone').optional().notEmpty(),
  body('department').optional().notEmpty(),
  body('designation').optional().notEmpty(),
  body('salary').optional().isNumeric(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  body('reportingManager').optional().isMongoId(),
];
