import { AuthenticatedRequest } from "general.type";
import currentUserService from "./current-user.service";
import { HttpStatusCode } from "@/enums/http-status-code.enum";
import { messages } from "@/lang";
import { Response } from "express";

const profile = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const user = await currentUserService.profile(req.user?.id as number);

		res.status(HttpStatusCode.Ok).json({
			message: messages.success,
			data: user,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const user = await currentUserService.updateProfile(req.user?.id as number, req.body);

		res.status(HttpStatusCode.Ok).json({
			message: messages.dataSaved,
			data: user,
		});
	} catch (error) {
		console.log(error);

		res.status(HttpStatusCode.InternalServerError).json({
			message: messages.httpInternalServerError
		});
	}
}

const currentUserController = {
	profile,
	updateProfile,
}

export default currentUserController;