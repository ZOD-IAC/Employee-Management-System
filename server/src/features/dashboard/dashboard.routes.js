import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/auth.middleware.js';
import { getDashboardStats } from './dashboard.controller.js';

const router = express.Router();
router.use(protect);

router.get('/stats', authorize('SUPER_ADMIN', 'HR_MANAGER'), getDashboardStats);

export default router;
