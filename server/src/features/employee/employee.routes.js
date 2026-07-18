import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import { authorize } from '../../middleware/auth.middleware.js';
import {
  createEmployeeValidation,
  updateEmployeeValidation,
} from './employee.validation.js';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateProfile,
  getReportees,
  updateManager,
} from './employee.controller.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('SUPER_ADMIN', 'HR_MANAGER'),
  createEmployeeValidation,
  validate,
  createEmployee,
);

router.get('/', authorize('SUPER_ADMIN', 'HR_MANAGER'), getEmployees);

router.get('/:id', getEmployeeById); // self or admin/hr — check in controller

router.put(
  '/:id',
  authorize('SUPER_ADMIN', 'HR_MANAGER'),
  updateEmployeeValidation,
  validate,
  updateEmployee,
);

router.patch('/:id/profile', updateProfile); // employee self-update, limited fields

router.delete('/:id', authorize('SUPER_ADMIN'), deleteEmployee);

router.get('/:id/reportees', getReportees);

router.patch(
  '/:id/manager',
  authorize('SUPER_ADMIN', 'HR_MANAGER'),
  updateManager,
);

export default router;
