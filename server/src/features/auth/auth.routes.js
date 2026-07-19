import express from 'express';
import { login, logout, me } from './auth.controller.js';
import { loginValidation } from './auth.validation.js';
import { validate } from '../../middleware/validation.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
export default router;
