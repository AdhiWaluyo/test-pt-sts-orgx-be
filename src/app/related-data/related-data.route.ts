import express from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import relatedDataController from './related-data.controller';

const relatedDataRoutes = express
	.Router()
	.use(authMiddleware);

relatedDataRoutes
	.route('/roles')
	.get(relatedDataController.listRoles);

relatedDataRoutes
	.route('/provinces')
	.get(relatedDataController.listRegionProvinces);

relatedDataRoutes
	.route('/cities')
	.get(relatedDataController.listRegionCities);

relatedDataRoutes
	.route('/districts')
	.get(relatedDataController.listRegionDistrict);

relatedDataRoutes
	.route('/villages')
	.get(relatedDataController.listRegionVillages);

export default relatedDataRoutes;