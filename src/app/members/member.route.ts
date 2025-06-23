import express from 'express';
import { memberValidation } from './member.validation';
import memberController from './member.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const memberRoutes = express.Router();

// Public
memberRoutes
	.route('/')
	.post(memberValidation, memberController.create);

// Sub-router for protected routes
const protectedRoutes = express.Router();

// Use auth middleware
protectedRoutes.use(authMiddleware);

protectedRoutes
	.route('/')
	.get(memberController.list);

protectedRoutes
	.route('/:id')
	.get(memberController.getOne)
	.patch(memberValidation, memberController.update)
	.delete(memberController.remove);

// Tempelkan sub-router ke memberRoutes
memberRoutes.use(protectedRoutes);

export default memberRoutes;
