import express from 'express';
import { createUserValidation, updateUserValidation } from './user.validation';
import userController from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role-middleware';
import roleEnum from '@/enums/role.enum';

// Routes
const userRoutes = express
	.Router()
	.use(authMiddleware);;

userRoutes
	.route('/')
	.get(roleMiddleware([roleEnum.ADMIN, roleEnum.USER]), userController.list)
	.post(createUserValidation, userController.create);

userRoutes
	.route('/:id')
	.get(roleMiddleware([roleEnum.ADMIN, roleEnum.USER]), userController.getOne)
	.patch(roleMiddleware([roleEnum.ADMIN, roleEnum.USER]), updateUserValidation, userController.update)
	.delete(roleMiddleware([roleEnum.ADMIN, roleEnum.USER]), userController.remove)

export default userRoutes;