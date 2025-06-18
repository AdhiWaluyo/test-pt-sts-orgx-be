import express from 'express';
import { memberValidation } from './member.validation';
import memberController from './member.controller';

const memberRoutes = express
	.Router()

memberRoutes
	.route('/')
	.post(memberValidation, memberController.create)
	.get(memberController.list);

memberRoutes
	.route('/:id')
	.get(memberController.getOne)
	.patch(memberValidation, memberController.update)
	.delete(memberController.remove)

export default memberRoutes;