import { AuthenticatedRequest } from "general.type";
import { Response } from "express";
import dashboardService from "./dashboard.service";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";

const summary = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const summaries = await dashboardService.getSummary(req.user?.id as number);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: summaries
		});
	} catch (error) {
		console.error(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
};

const chart = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const charts = await dashboardService.getChart(req.user?.id as number);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: charts
		});
	} catch (error) {
		console.error(error);
		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
};

const dashboardController = {
	summary,
	chart,
};

export default dashboardController;
