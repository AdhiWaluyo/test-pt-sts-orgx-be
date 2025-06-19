import { AuthenticatedRequest } from "general.type";
import { Response } from "express";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import recapitulationService from "./recapitulation.service";
import { transformRecapitulation } from "./recapitulation.transformer";

const list = async (req: AuthenticatedRequest, res: Response) => {
	try {

		const { data, meta } = await recapitulationService.getWilayahSummaryByUser(req.user?.id as number, req.query);

		const isVillageLevel = data.length > 0 && (data[0] as { nik: string }).nik;

		const transformedRecapitulation = isVillageLevel
			? data.map(transformRecapitulation)
			: data;

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: transformedRecapitulation,
			meta,
		})
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const recapitulationController = {
	list,
};

export default recapitulationController;
