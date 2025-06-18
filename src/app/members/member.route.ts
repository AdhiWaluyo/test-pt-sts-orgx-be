import express from 'express';
import { roleValidation } from './role.validation';
import roleController from './member.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const roleRoutes = express
	.Router()
	.use(authMiddleware);

roleRoutes
	.route('/')
	.get(roleController.list);

roleRoutes
	.route('/:id')
	.get(roleController.getOne)
	.put(roleValidation, roleController.update)
	.delete(roleController.remove)

export default roleRoutes;