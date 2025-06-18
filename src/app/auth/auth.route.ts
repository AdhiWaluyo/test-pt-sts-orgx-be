import express from 'express';
import authController from './auth.controller';
import { loginValidation, registerValidation } from './auth.validation';

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

export default authRoutes;