import express from 'express';
import relatedDataController from './related-data.controller';

const relatedDataRoutes = express
	.Router();

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

relatedDataRoutes
	.route('/regions')
	.get(relatedDataController.getRegionByIdAndType);

export default relatedDataRoutes;