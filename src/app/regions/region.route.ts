import express from 'express';
import regionController from "./region.controller";

const regionRoutes = express
	.Router()

regionRoutes
	.route('/provinces')
	.get(regionController.listProvinsi);

regionRoutes
	.route('/provinces/:id')
	.get(regionController.getOneProvince);

regionRoutes
	.route('/cities')
	.get(regionController.listCity);

regionRoutes
	.route('/districts')
	.get(regionController.listDistrict);

regionRoutes
	.route('/villages')
	.get(regionController.listVillages);

export default regionRoutes;