import express from 'express';
import { createUserValidation, updateUserValidation } from './user.validation';
import userController from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { roleMiddleware } from '@/middlewares/role-middleware';
import { roleEnum } from "@/enums/role.enum";

// Routes
const userRoutes = express
	.Router()
	.use(authMiddleware);;

userRoutes
	.route('/')
	.get(roleMiddleware([roleEnum.CENTRAL_ADMIN]), userController.list)
	.post(createUserValidation, userController.create);

userRoutes
	.route('/:id')
	.get(roleMiddleware([roleEnum.CENTRAL_ADMIN]), userController.getOne)
	.patch(roleMiddleware([roleEnum.CENTRAL_ADMIN]), updateUserValidation, userController.update)
	.delete(roleMiddleware([roleEnum.CENTRAL_ADMIN]), userController.remove);

userRoutes
	.patch(
		'/:id/active-status',
		roleMiddleware([roleEnum.CENTRAL_ADMIN]),
		userController.updateIsActiveStatus
	);

export default userRoutes;