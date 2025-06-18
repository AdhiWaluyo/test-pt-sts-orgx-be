import { Response } from "express";
import regionService from "./region.service";
import { messages } from "@/lang";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { transformRegion } from "./region.transformer";
import { AuthenticatedRequest } from "general.type";

const list = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const { regions, meta } = await regionService.list(req.query);

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

const getOne = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const region = await regionService.getOne(parseInt(req.params.id));

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

const regionController = {
	list,
	getOne,
}

export default regionController; 