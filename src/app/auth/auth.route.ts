import express from 'express';
import authController from './auth.controller';
import { loginValidation, registerValidation } from './auth.validation';
import { authMiddleware } from '@/middlewares/auth.middleware';

// Routes
const authRoutes = express.Router();

// Login Route
authRoutes
	.route('/login')
	.post(loginValidation, authController.login);

// Register Route
authRoutes
	.route('/register')
	.post(registerValidation, authController.register);

// Logout Route
authRoutes
	.route('/logout')
	.post(authMiddleware, authController.logout);

export default authRoutes;