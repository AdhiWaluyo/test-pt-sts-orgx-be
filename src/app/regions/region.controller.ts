import { Response } from "express";
import regionService from "./region.service";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { transformRegion } from "./region.transformer";
import { AuthenticatedRequest } from "general.type";
import regionEnum from "@/enums/region.enum";

const listProvinsi = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { regions, meta } = await regionService.listProvince(req.query);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: regions,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const getOneProvince = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const region = await regionService.getOneProvince(parseInt(req.params.id));

		if (!region) {
			res.status(HttpStatusCode.NotFound).json({
				message: messages.httpNotFound
			});
			return
		}

		const transformedRegion = transformRegion(region);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedRegion,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const listCity = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { province_id } = req.query;

		if (!province_id) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'province_id is required' });
			return;
		}

		const { regions, meta } = await regionService.listByType(regionEnum.CITY, req.query, { provinceId: Number(province_id) });

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: regions,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const listDistrict = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { city_id } = req.query;

		if (!city_id) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'city_id is required' });
			return;
		}

		const { regions, meta } = await regionService.listByType(regionEnum.DISTRICT, req.query, { cityId: Number(city_id) });

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: regions,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const listVillages = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { district_id } = req.query;

		if (!district_id) {
			res.status(HttpStatusCode.BadRequest).json({ message: 'district_id is required' });
			return;
		}

		const { regions, meta } = await regionService.listByType(regionEnum.VILLAGE, req.query, { districtId: Number(district_id) });

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: regions,
			meta,
		});
	} catch (err) {
		console.log(err);
		res.status(HttpStatusCode.InternalServerError).json({ message: messages.httpInternalServerError });
	}
};

const regionController = {
	listProvinsi,
	getOneProvince,
	listCity,
	listDistrict,
	listVillages
};


export default regionController; 