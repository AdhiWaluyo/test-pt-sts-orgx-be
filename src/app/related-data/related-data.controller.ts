import { Response } from "express";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { AuthenticatedRequest } from "general.type";
import reletedDataService from "./related-data.service";
import { transformRelatedData, transformRelatedDataRegion } from "./related-data.transformer";
import regionEnum from "@/enums/region.enum";

const listRoles = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { roles, meta } = await reletedDataService.listRoles(req.query);

		const transformedRole = roles.map(transformRelatedData);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedRole,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const listRegionProvinces = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { regions, meta } = await reletedDataService.listRegionProvinces(req.query);

		const transformedProvince = regions.map(transformRelatedDataRegion);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedProvince,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const listRegionCities = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { provinceId } = req.query;

		if (!provinceId) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'provinceId is required' });
			return;
		}

		const { regions, meta } = await reletedDataService.listRegionByType(regionEnum.CITY, req.query, { provinceId: Number(provinceId) });

		const transformedCity = regions.map(transformRelatedDataRegion);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedCity,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const listRegionDistrict = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { cityId } = req.query;

		if (!cityId) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'cityId is required' });
			return;
		}

		const { regions, meta } = await reletedDataService.listRegionByType(regionEnum.DISTRICT, req.query, { cityId: Number(cityId) });

		const transformedDistrict = regions.map(transformRelatedDataRegion);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedDistrict,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const listRegionVillages = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { districtId } = req.query;

		if (!districtId) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'districtId is required' });
			return;
		}

		const { regions, meta } = await reletedDataService.listRegionByType(regionEnum.VILLAGE, req.query, { districtId: Number(districtId) });

		const transformedVillage = regions.map(transformRelatedDataRegion);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedVillage,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const relatedDataController = {
	listRoles,
	listRegionProvinces,
	listRegionCities,
	listRegionDistrict,
	listRegionVillages
}

export default relatedDataController; 