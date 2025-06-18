import express from 'express';
import currentUserController from './current-user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { updateProfileValidation } from './current-user.validation';

const currentUserRoutes = express
	.Router()
	.use(authMiddleware);

currentUserRoutes
	.route('/')
	.get(currentUserController.profile)
	.patch(updateProfileValidation, currentUserController.updateProfile);

export default currentUserRoutes;