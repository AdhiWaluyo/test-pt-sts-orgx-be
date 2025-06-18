import express from 'express';
import regionController from "./region.controller";

const regionRoutes = express
	.Router()

regionRoutes
	.route('/')
	.get(regionController.list);

regionRoutes
	.route('/:id')
	.get(regionController.getOne);

export default regionRoutes;