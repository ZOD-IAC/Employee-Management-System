import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/auth.middleware.js';
import {
  getOrgTree,
  getReportees,
  updateManager,
} from './organization.controller.js';

const router = express.Router();
router.use(protect);

router.get('/tree', getOrgTree);
router.get('/:id/reportees', getReportees);
router.patch(
  '/:id/manager',
  authorize('SUPER_ADMIN', 'HR_MANAGER'),
  updateManager,
);

export default router;
